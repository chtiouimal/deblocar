import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
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
    const filterType = searchParams.get("filter") || "month";
    const now = new Date();

    let points: { label: string; leads: number; rdvs: number }[] = [];

    if (filterType === "day") {
      const day = parseInt(searchParams.get("day") || `${now.getDate()}`);
      const month = parseInt(
        searchParams.get("month") || `${now.getMonth() + 1}`,
      );
      const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);

      // 24 hours
      for (let h = 0; h < 24; h++) {
        const start = new Date(year, month - 1, day, h, 0, 0);
        const end = new Date(year, month - 1, day, h, 59, 59);

        const [leads, rdvs] = await Promise.all([
          Lead.countDocuments({ createdAt: { $gte: start, $lte: end } }),
          Devis.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        ]);

        points.push({ label: `${String(h).padStart(2, "0")}h`, leads, rdvs });
      }
    } else if (filterType === "month") {
      const month = parseInt(
        searchParams.get("month") || `${now.getMonth() + 1}`,
      );
      const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);
      const daysInMonth = new Date(year, month, 0).getDate();

      for (let d = 1; d <= daysInMonth; d++) {
        const start = new Date(year, month - 1, d, 0, 0, 0);
        const end = new Date(year, month - 1, d, 23, 59, 59);

        const [leads, rdvs] = await Promise.all([
          Lead.countDocuments({ createdAt: { $gte: start, $lte: end } }),
          Devis.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        ]);

        points.push({ label: `${d}`, leads, rdvs });
      }
    } else {
      // year → 12 months
      const year = parseInt(searchParams.get("year") || `${now.getFullYear()}`);
      const monthNames = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];

      for (let m = 0; m < 12; m++) {
        const start = new Date(year, m, 1, 0, 0, 0);
        const end = new Date(year, m + 1, 0, 23, 59, 59);

        const [leads, rdvs] = await Promise.all([
          Lead.countDocuments({ createdAt: { $gte: start, $lte: end } }),
          Devis.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        ]);

        points.push({ label: monthNames[m], leads, rdvs });
      }
    }

    return NextResponse.json({ points, filter: filterType });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
