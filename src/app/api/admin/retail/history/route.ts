import "@/models/RetailOrder";
import "@/models/RetailOrderItem";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    const [transactions, total, consumed, topups] = await Promise.all([
      RetailTokenTransaction.find(filter)
        .populate({
          path: "retailUserId",
          select: "name email",
        })
        .populate({
          path: "orderId",
          select:
            "status totalItems totalTokens balanceBefore balanceAfter createdAt items",
          populate: {
            path: "items",
            select:
              "ntgName regionName versionName vin tokenCost status createdAt",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      RetailTokenTransaction.countDocuments(filter),

      RetailTokenTransaction.aggregate([
        {
          $match: {
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

      RetailTokenTransaction.aggregate([
        {
          $match: {
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
