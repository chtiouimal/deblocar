import { transporter } from "@/lib/mailer";
import { validateDevisBackend } from "@/lib/validation/devisValidation";
import { clientEmailTemplate } from "@/templates/email";

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Lead from "@/models/Lead";
import Service from "@/models/Service";
import Status from "@/models/Status";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 VALIDATION
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

    const {
      name,
      email,
      phone,
      brand,
      year,
      vin,
      mPoste,
      services,
      city = null,
    } = body;

    // 🔌 CONNECT DB
    await connectDB();

    // 📦 GET SERVICES FROM DB
    const servicesFromDB = await Service.find({
      _id: { $in: services },
      isDeleted: false,
    });

    // 🧾 SERVICE NAMES
    const servicesNames = servicesFromDB.map((service) => service.title);

    // ✉️ FORMATTED STRING FOR EMAIL
    const formattedServices = servicesNames.join(", ");

    // 🔥 SCORE LOGIC
    let score: "Froid" | "Tiède" | "Chaud" = "Tiède";

    if (services.length < 3) {
      score = "Froid";
    } else if (services.length > 6) {
      score = "Chaud";
    }

    const defaultStatus = await Status.findOne({ label: "Nouveau" });

    // 🧠 NORMALIZE CAR DATA (IMPORTANT FIX)
    const isLuxury = brand === "BMW" || brand === "Mercedes";

    const finalVin = isLuxury ? vin : null;
    const finalMPoste = isLuxury ? null : mPoste;

    // 💾 SAVE LEAD
    await Lead.create({
      name,
      email,
      phone,
      brand,
      year,
      vin: finalVin,
      mPoste: finalMPoste,
      services,
      city,
      score,
      status: defaultStatus._id,
      date: null,
    });

    // 📩 EMAIL CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de votre demande - Deblocar",
      html: clientEmailTemplate({
        name,
        brand,
        year,
        vin: finalVin,
        mPoste: finalMPoste,
        services: formattedServices,
      }),
    });

    // 📩 EMAIL ADMIN
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nouveau lead reçu",
      text: `
Nom: ${name}
Email: ${email}
Téléphone: ${phone}
Marque: ${brand}
Année: ${year}
${finalVin ? `Numéro de châssis: ${finalVin}` : finalMPoste ? `Modèle de poste: ${finalMPoste}` : `Informations véhicule : Non renseigné`}
Services: ${formattedServices}
Score: ${score}
      `,
    });

    return NextResponse.json(
      {
        message: "Success",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}