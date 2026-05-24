import { transporter } from "@/lib/mailer";
import { validateDevisBackend } from "@/lib/validation/devisValidation";
import { clientEmailTemplate } from "@/templates/email";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devis from "@/models/Devis";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 VALIDATION FIRST
    const { isValid, errors } = validateDevisBackend(body);

    if (!isValid) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: 400 },
      );
    }

    const { name, email, phone, brand, model, year, vin, services } = body;

    const formattedServices = services.join(", ");

    // 🔌 CONNECT DB
    await connectDB();

    // 💾 SAVE TO MONGODB
    await Devis.create({
      name,
      email,
      phone,
      brand,
      model,
      year,
      vin,
      services,
    });

    // 📩 EMAIL CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de votre demande de devis - Deblocar",
      text: clientEmailTemplate({
        name,
        brand,
        year,
        vin,
        services: formattedServices,
      }),
    });

    // 📩 EMAIL ADMIN
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nouvelle demande de devis",
      text: `
Nom: ${name}
Email: ${email}
Téléphone: ${phone}
Marque: ${brand}
Modèle: ${model}
Année: ${year}
VIN: ${vin}
Services: ${formattedServices}
      `,
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET ALL DEVIS
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [devis, total] = await Promise.all([
      Devis.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

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
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching devis" },
      { status: 500 },
    );
  }
}