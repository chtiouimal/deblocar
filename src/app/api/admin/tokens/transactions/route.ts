import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const transactions = await RetailTokenTransaction.find()
      .populate("retailUserId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      transactions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
