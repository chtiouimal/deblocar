import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import { requireRetailAuth } from "@/lib/requireAuth";

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

    const filter: any = {
      retailUserId: auth.userId,
    };

    // filter by transaction type
    if (type) {
      filter.type = type;
    }

    const [transactions, total] = await Promise.all([
      RetailTokenTransaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      RetailTokenTransaction.countDocuments(filter),
    ]);

    return NextResponse.json({
      transactions,
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
