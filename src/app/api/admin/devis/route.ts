import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devis from "@/models/Devis";
import "@/models/Service";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest) {
  try {
    // 🔒 AUTH
    const auth = requireAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // 📦 FETCH DATA
    const [devis, total] = await Promise.all([
      Devis.find()
        .populate("services", "title price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Devis.countDocuments(),
    ]);

    return NextResponse.json({
      devis,
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
      { message: "Error fetching devis" },
      { status: 500 },
    );
  }
}
