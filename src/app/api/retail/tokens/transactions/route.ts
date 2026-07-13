import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import { requireRetailAuth } from "@/lib/requireAuth";
import { Types } from "mongoose";

export async function GET(req: Request) {
  try {
    const auth = requireRetailAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type"); // topup | consume

    const skip = (page - 1) * limit;

    const userId = new Types.ObjectId(auth.userId);

    // History filter (with optional type)
    const filter: any = {
      retailUserId: userId,
    };

    if (type) {
      filter.type = type;
    }

    // Stats should not depend on the selected tab/filter
    const statsFilter = {
      retailUserId: userId,
    };

    const [transactions, total, consumed, topups] = await Promise.all([
      // Paginated transactions
      RetailTokenTransaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      // Total transactions with current filter
      RetailTokenTransaction.countDocuments(filter),

      // Total consumed tokens
      RetailTokenTransaction.aggregate([
        {
          $match: {
            ...statsFilter,
            type: "consume",
          },
        },
        {
          $group: {
            _id: null,
            totalConsumed: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Total topup tokens
      RetailTokenTransaction.aggregate([
        {
          $match: {
            ...statsFilter,
            type: "topup",
          },
        },
        {
          $group: {
            _id: null,
            totalTopups: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      transactions,

      totalConsumed: consumed[0]?.totalConsumed ?? 0,
      totalTopups: topups[0]?.totalTopups ?? 0,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
