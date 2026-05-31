import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";

import Lead from "@/models/Lead";
import "@/models/City";
import "@/models/Service";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const brand = searchParams.get("brand");
    const score = searchParams.get("score");
    const date = searchParams.get("date");

    const services = searchParams.get("services"); // comma-separated ids

    const skip = (page - 1) * limit;

    // 🧠 BUILD FILTER DYNAMICALLY
    const filter: any = {};

    if (status) filter.status = status;
    if (city) filter.city = city;
    if (brand) filter.brand = brand;
    if (score) filter.score = score;

    if (services) {
      filter.services = { $in: services.split(",") };
    }

    if (date) {
      const d = new Date(date);
      filter.date = {
        $gte: new Date(d.setHours(0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59)),
      };
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate("services", "title price")
        .populate("city", "name")
        .populate("status", "label color")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Lead.countDocuments(filter),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching leads" },
      { status: 500 },
    );
  }
}
