import { connectDB } from "@/lib/mongodb";
import Status from "@/models/Status";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const statuses = await Status.find({ isDeleted: false }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ statuses });
}
