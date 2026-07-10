import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RetailWallet from "@/models/RetailWallet";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import RetailUser from "@/models/RetailUser";
import { requireRetailAuth } from "@/lib/requireAuth";
import { transporter } from "@/lib/mailer";

const GENERATION_COST = 3;

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

    // Check balance
    if (wallet.balance < GENERATION_COST) {
      return NextResponse.json(
        {
          message: "Insufficient tokens",
          balance: wallet.balance,
        },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);

    const hu = searchParams.get("hu");
    const region = searchParams.get("region");
    const version = searchParams.get("version");
    const vin = searchParams.get("vin");

    const apiKey = process.env.MBTOOLS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ message: "API key missing" }, { status: 500 });
    }

    const params = new URLSearchParams({
      hu: hu ?? "",
      region: region ?? "",
      version: version ?? "",
      vin: vin ?? "",
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

Thank you.
      `,
    });

    // Deduct tokens
    const balanceBefore = wallet.balance;

    wallet.balance -= GENERATION_COST;

    await wallet.save();

    // Save transaction
    await RetailTokenTransaction.create({
      retailUserId: auth.userId,
      type: "consume",
      amount: GENERATION_COST,
      balanceBefore,
      balanceAfter: wallet.balance,
      note: "Map pin generation",
    });

    return NextResponse.json({
      ...data,
      balance: wallet.balance,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
