import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devis from "@/models/Devis";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const now = new Date();

    const month = parseInt(
      searchParams.get("month") || `${now.getMonth() + 1}`,
    );
    const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);

    // start of month
    const start = new Date(year, month - 1, 1);

    // end of month
    const end = new Date(year, month, 0, 23, 59, 59);

    const rdvs = await Devis.find({
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .select("_id date name location brand phone")
      .sort({ date: 1 });

    return NextResponse.json({
      rdvs,
      month,
      year,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching calendar" },
      { status: 500 },
    );
  }
}
