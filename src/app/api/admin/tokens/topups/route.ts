import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RetailWallet from "@/models/RetailWallet";
import RetailTokenTransaction, {
  TokenTransactionType,
} from "@/models/RetailTokenTransaction";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const auth = requireAuth(req);

    if (!auth) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { retailUserId, amount } = await req.json();

    if (!retailUserId || !amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const wallet = await RetailWallet.findOne({ retailUserId });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 },
      );
    }

    const balanceBefore = wallet.balance;

    wallet.balance += amount;

    await wallet.save();

    await RetailTokenTransaction.create({
      retailUserId,

      type: TokenTransactionType.TOPUP,

      amount,

      balanceBefore,

      balanceAfter: wallet.balance,

      note: "Admin top up",
    });

    return NextResponse.json({
      message: "Top up successful",
      balance: wallet.balance,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
