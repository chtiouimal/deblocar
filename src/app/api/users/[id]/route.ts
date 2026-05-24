import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const body = await req.json();

    const user = await User.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        email: body.email,
      },
      { new: true },
    );

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE USER
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}