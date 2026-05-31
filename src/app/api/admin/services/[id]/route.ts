import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAuth } from "@/lib/requireAuth";

export async function PUT(
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

    const body = await req.json();

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        price: body.price,
      },
      { new: true },
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating service" },
      { status: 500 },
    );
  }
}

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

    await Service.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return NextResponse.json({
      message: "Service deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting service" },
      { status: 500 },
    );
  }
}
