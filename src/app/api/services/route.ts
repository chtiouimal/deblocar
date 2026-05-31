import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ services });
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching services" },
      { status: 500 },
    );
  }
}
