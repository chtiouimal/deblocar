import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import RetailUser from "@/models/RetailUser";
import RetailWallet from "@/models/RetailWallet";

// GET ALL USERS
export async function GET(req: Request) {
  try {
    await connectDB();
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [wallets, total] = await Promise.all([
      RetailWallet.find()
        .populate({
          path: "retailUserId",
          select: "-password",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      RetailWallet.countDocuments(),
    ]);

    const users = wallets.map((wallet) => ({
      ...(wallet.retailUserId as any).toObject(),
      balance: wallet.balance,
    }));

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 },
    );
  }
}