import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const auth = requireAuth(req);
    
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const service = await Service.create({
      title: body.title,
      description: body.description,
      price: body.price
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating service" },
      { status: 500 },
    );
  }
}
