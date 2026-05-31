import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import Status from "@/models/Status";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await Status.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return NextResponse.json({
      message: "Status deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting Status" },
      { status: 500 },
    );
  }
}
