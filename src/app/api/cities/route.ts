import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import City from "@/models/City";

export async function GET() {
  try {
    await connectDB();

    const cities = await City.find().sort({ name: 1 }).select("_id name");

    return NextResponse.json({
      cities,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching cities" },
      { status: 500 },
    );
  }
}
