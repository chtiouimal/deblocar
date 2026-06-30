import { transporter } from "@/lib/mailer";
import { validateDevisBackend } from "@/lib/validation/devisValidation";
import { clientEmailTemplate } from "@/templates/email";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devis from "@/models/Devis";
import Service from "@/models/Service";

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

    const { name, email, phone, brand, year, vin, mPoste, services } = body;

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

    console.log("vin: ", vin);
    console.log("mPoste: ", mPoste);

    // 💰 TOTAL PRICE
    const totalPrice = servicesFromDB.reduce(
      (acc, service) => acc + service.price,
      0,
    );

    // 🧠 NORMALIZE CAR DATA (IMPORTANT FIX)
    const isLuxury = brand === "BMW" || brand === "Mercedes";

    const finalVin = isLuxury ? vin : null;
    const finalMPoste = isLuxury ? null : mPoste;

    // 💾 SAVE DEVIS
    await Devis.create({
      name,
      email,
      phone,
      brand,
      year,
      vin: finalVin,
      mPoste: finalMPoste,
      services,
      totalPrice,
    });

    console.log(
      "data send to the email template: ",
      {
        name,
        brand,
        year,
        vin: finalVin,
        mPoste: finalMPoste,
        services: formattedServices,
      },
      vin,
      mPoste,
      finalVin,
      finalMPoste,
    );

    // 📩 EMAIL CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de votre demande de devis - Deblocar",
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
      subject: "Nouvelle demande de devis",
      text: `
Nom: ${name}
Email: ${email}
Téléphone: ${phone}
Marque: ${brand}
Année: ${year}
${finalVin ? `Numéro de châssis: ${finalVin}` : finalMPoste ? `Modèle de poste: ${finalMPoste}` : `Informations véhicule : Non renseigné`}
Services: ${formattedServices}
Prix total: ${totalPrice} DT
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

// GET ALL DEVIS
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [devis, total] = await Promise.all([
      Devis.find()
        .populate("services")
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
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching devis" },
      { status: 500 },
    );
  }
}