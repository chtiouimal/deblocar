import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";

import Lead from "@/models/Lead";
import "@/models/City";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const lead = await Lead.findById(id)
      .populate("services", "title price")
      .populate("city", "name");

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching lead" },
      { status: 500 },
    );
  }
}