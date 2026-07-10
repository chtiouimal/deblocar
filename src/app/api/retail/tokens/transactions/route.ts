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

    const transactions = await RetailTokenTransaction.find({
      retailUserId: auth.userId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      transactions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
