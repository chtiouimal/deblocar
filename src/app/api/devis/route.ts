import { transporter } from "@/lib/mailer";
import { validateDevisBackend } from "@/lib/validation/devisValidation";
import { clientEmailTemplate } from "@/templates/email";
import { NextResponse } from "next/server";

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

    // Optional Formspree backup
    const formspreeUrl = process.env.FORMSPREE_URL;

    if (formspreeUrl) {
      await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          brand,
          model,
          year,
          vin,
          services: formattedServices,
        }),
      });
    }

    // EMAIL CLIENT
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

    // EMAIL YOU
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
