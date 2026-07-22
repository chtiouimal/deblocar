import "@/models/RetailOrder";
import "@/models/RetailOrderItem";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid transaction id",
        },
        {
          status: 400,
        },
      );
    }

    const transaction = await RetailTokenTransaction.findById(id)
      .populate({
        path: "retailUserId",
        select: "name email",
      })
      .populate({
        path: "orderId",
        select:
          "status totalItems totalTokens balanceBefore balanceAfter createdAt",
        populate: {
          path: "items",
          select:
            "ntgName displayName region regionName version versionName vin tokenCost pin status error createdAt",
        },
      });

    if (!transaction) {
      return NextResponse.json(
        {
          message: "Transaction not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      transaction,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
