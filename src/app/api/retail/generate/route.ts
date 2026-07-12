import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RetailWallet from "@/models/RetailWallet";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import RetailUser from "@/models/RetailUser";
import { requireRetailAuth } from "@/lib/requireAuth";
import { transporter } from "@/lib/mailer";

export async function GET(req: Request) {
  try {
    const auth = requireRetailAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user
    const user = await RetailUser.findById(auth.userId).select("email name");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get wallet
    const wallet = await RetailWallet.findOne({
      retailUserId: auth.userId,
    });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);

    const hu = searchParams.get("hu");
    const region = searchParams.get("region");
    const version = searchParams.get("version");
    const vin = searchParams.get("vin");

    if (!hu || !region || !version || !vin) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const apiKey = process.env.MBTOOLS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ message: "API key missing" }, { status: 500 });
    }

    // Fetch MBTools parameters to get token cost
    const parametersResponse = await fetch("https://api.mbtools.com/map", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!parametersResponse.ok) {
      return NextResponse.json(
        { message: "Unable to fetch parameters" },
        { status: 500 },
      );
    }

    const parameters = await parametersResponse.json();

    const selectedHu = parameters.find((item: any) => item.shortName === hu);

    if (!selectedHu) {
      return NextResponse.json({ message: "Invalid HU" }, { status: 400 });
    }

    const generationCost = selectedHu.tokenCost;

    // Check balance
    if (wallet.balance < generationCost) {
      return NextResponse.json(
        {
          message: "Insufficient tokens",
          balance: wallet.balance,
          required: generationCost,
        },
        { status: 400 },
      );
    }

    // Generate PIN
    const params = new URLSearchParams({
      hu,
      region,
      version,
      vin,
      apiKey,
    });

    const response = await fetch(`https://api.mbtools.com/map?${params}`);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Code generation failed" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const pin = data.pin;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your generated map PIN",
      text: `
Hello ${user.name},

Your map PIN has been generated successfully.

PIN: ${pin}

Tokens used: ${generationCost}
Remaining balance: ${wallet.balance - generationCost}

Thank you.
      `,
    });

    // Deduct tokens
    const balanceBefore = wallet.balance;

    wallet.balance -= generationCost;

    await wallet.save();

    // Save transaction
    await RetailTokenTransaction.create({
      retailUserId: auth.userId,
      type: "consume",
      amount: generationCost,
      balanceBefore,
      balanceAfter: wallet.balance,
      note: `Map pin generation (${selectedHu.ntgName})`,
    });

    return NextResponse.json({
      ...data,
      balance: wallet.balance,
      tokensUsed: generationCost,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
