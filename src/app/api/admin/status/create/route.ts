import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import Status from "@/models/Status";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const auth = requireAuth(req);
    
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { label, color } = await req.json();

    const status = await Status.create({
      label,
      color,
    });

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating status" },
      { status: 500 },
    );
  }
}
