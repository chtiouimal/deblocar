import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

import { connectDB } from "@/lib/mongodb";

import RetailPayment, { RetailPaymentStatus } from "@/models/RetailPayment";

import RetailOrder from "@/models/RetailOrder";

import RetailOrderItem from "@/models/RetailOrderItem";

import { generateOrderPins } from "@/lib/retail/generateOrderPins";

import { orderEmailTemplate } from "@/templates/orderEmailTemplate";

import { transporter } from "@/lib/mailer";

import { RetailOrderStatus } from "@/models/RetailOrder";

import RetailUser from "@/models/RetailUser";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,

      signature,

      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }

  await connectDB();

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    const payment = await RetailPayment.findOne({
      stripePaymentIntentId: intent.id,
    });

    if (!payment) {
      return NextResponse.json({
        received: true,
      });
    }

    if (payment.status === RetailPaymentStatus.SUCCEEDED) {
      return NextResponse.json({
        received: true,
      });
    }

    payment.status = RetailPaymentStatus.SUCCEEDED;

    await payment.save();

    const order = await RetailOrder.findById(payment.orderId);

    if (!order) {
      return NextResponse.json({
        received: true,
      });
    }

    order.paymentId = payment._id;

    const orderItems = await RetailOrderItem.find({
      orderId: order._id,
    });

    const results = await generateOrderPins(orderItems);

    const successCount = results.filter(Boolean).length;

    if (successCount === orderItems.length) {
      order.status = RetailOrderStatus.COMPLETED;
    } else if (successCount === 0) {
      order.status = RetailOrderStatus.ACTION_REQUIRED;
    } else {
      order.status = RetailOrderStatus.PARTIAL;
    }

    await order.save();
    const user = await RetailUser.findById(order.retailUserId).select(
      "email name",
    );

    if (user) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: user.email,

        subject: "Commande Mercedes-Benz - Deblocar",

        html: orderEmailTemplate({
          name: user.name,

          orderId: order._id,

          items: results.filter(Boolean),

          totalItems: order.totalItems,

          totalTokens: order.totalTokens,

          balance: null, // card payment, no token balance change
        }),
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;

    const payment = await RetailPayment.findOne({
      stripePaymentIntentId: intent.id,
    });

    if (!payment) {
      return NextResponse.json({
        received: true,
      });
    }

    // avoid updating already processed payments
    if (
      payment.status === RetailPaymentStatus.FAILED ||
      payment.status === RetailPaymentStatus.SUCCEEDED
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    payment.status = RetailPaymentStatus.FAILED;

    await payment.save();

    const order = await RetailOrder.findById(payment.orderId);

    if (order) {
      order.paymentId = payment._id;
      order.status = RetailOrderStatus.FAILED;
      await order.save();
    }
  }

  return NextResponse.json({
    received: true,
  });
}
