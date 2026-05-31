import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Devis from "@/models/Devis";
import Status from "@/models/Status";
import "@/models/Service";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // 🔒 AUTH
    const auth = requireAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { date, location } = await req.json();

    await connectDB();

    // 1. GET LEAD
    const lead = await Lead.findById(id).populate("services");

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    // 2. GET STATUS (IMPORTANT FIX)
    const rdvStatus = await Status.findOne({ label: "RDV fixé" });

    if (!rdvStatus) {
      return NextResponse.json(
        { message: "RDV status not found" },
        { status: 404 },
      );
    }

    // 3. CALCULATE TOTAL PRICE
    const totalPrice = lead.services.reduce(
      (acc: number, service: any) => acc + service.price,
      0,
    );

    // 4. CREATE DEVIS
    const devis = await Devis.create({
      leadId: lead._id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      brand: lead.brand,
      year: lead.year,
      vin: lead.vin,
      services: lead.services.map((s: any) => s._id),
      totalPrice,
      date,
      location,
    });

    // 5. UPDATE LEAD (FIXED)
    lead.status = rdvStatus._id; // ✅ ObjectId, not string
    lead.date = date;
    await lead.save();

    return NextResponse.json({
      message: "RDV created successfully",
      devis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
