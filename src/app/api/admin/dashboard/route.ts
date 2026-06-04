import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Devis from "@/models/Devis";
import Status from "@/models/Status";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    // --- FILTER SETUP ---
    const filterType = searchParams.get("filter") || "month";
    const now = new Date();

    let start: Date;
    let end: Date;

    if (filterType === "day") {
      const day = parseInt(searchParams.get("day") || `${now.getDate()}`);
      const month = parseInt(
        searchParams.get("month") || `${now.getMonth() + 1}`,
      );
      const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);
      start = new Date(year, month - 1, day, 0, 0, 0);
      end = new Date(year, month - 1, day, 23, 59, 59);
    } else if (filterType === "year") {
      const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);
      start = new Date(year, 0, 1, 0, 0, 0);
      end = new Date(year, 11, 31, 23, 59, 59);
    } else {
      const month = parseInt(
        searchParams.get("month") || `${now.getMonth() + 1}`,
      );
      const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);
      start = new Date(year, month - 1, 1, 0, 0, 0);
      end = new Date(year, month, 0, 23, 59, 59);
    }

    // --- TODAY (always fixed) ---
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    // --- RDV STATUS ---
    const rdvStatus = await Status.findOne({ label: "RDV fixé" });

    const [leadsToday, leadsTotal, upcomingRdvs, ca, leadsConverted] =
      await Promise.all([
        // Leads created today
        Lead.countDocuments({
          createdAt: { $gte: todayStart, $lte: todayEnd },
        }),

        // Total leads in filter range
        Lead.countDocuments({
          createdAt: { $gte: start, $lte: end },
        }),

        // Upcoming RDVs from now
        Devis.find({
          date: { $gte: now },
        })
          .select("_id name date location")
          .sort({ date: 1 })
          .limit(5),

        // CA = sum of totalPrice in filter range
        Devis.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),

        // Converted leads (RDV fixé) in filter range
        Lead.countDocuments({
          createdAt: { $gte: start, $lte: end },
          status: rdvStatus?._id,
        }),
      ]);

    const conversionRate =
      leadsTotal > 0 ? Math.round((leadsConverted / leadsTotal) * 100) : 0;

    return NextResponse.json({
      leadsToday,
      leadsTotal,
      upcomingRdvs,
      ca: ca[0]?.total || 0,
      conversionRate,
      filter: { type: filterType, start, end },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
