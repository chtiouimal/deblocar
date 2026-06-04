import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Devis from "@/models/Devis";
import Status from "@/models/Status";
import "@/models/Service";
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

    const rdvStatus = await Status.findOne({ label: "RDV fixé" });

    // Requested services from all leads (in range)
    const leadsRequested = await Lead.find({
      createdAt: { $gte: start, $lte: end },
    }).populate("services", "name");

    const requestedCount: Record<string, number> = {};
    for (const lead of leadsRequested) {
      for (const service of lead.services as any[]) {
        const name = service.name;
        requestedCount[name] = (requestedCount[name] || 0) + 1;
      }
    }

    // Sold services from devis with RDV fixé leads only
    const soldLeads = await Lead.find({
      createdAt: { $gte: start, $lte: end },
      status: rdvStatus?._id,
    }).select("_id");

    const soldLeadIds = soldLeads.map((l) => l._id);

    const devis = await Devis.find({
      leadId: { $in: soldLeadIds },
      createdAt: { $gte: start, $lte: end },
    }).populate("services", "name");

    const soldCount: Record<string, number> = {};
    for (const d of devis) {
      for (const service of d.services as any[]) {
        const name = service.name;
        soldCount[name] = (soldCount[name] || 0) + 1;
      }
    }

    // Merge into unified list
    const allServices = Array.from(
      new Set([...Object.keys(requestedCount), ...Object.keys(soldCount)]),
    );

    const services = allServices
      .map((name) => ({
        name,
        requested: requestedCount[name] || 0,
        sold: soldCount[name] || 0,
      }))
      .sort((a, b) => b.requested - a.requested)
      .slice(0, 8); // top 8

    return NextResponse.json({ services });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
