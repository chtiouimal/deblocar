import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import RetailOrder from "@/models/RetailOrder";
import RetailPayment from "@/models/RetailPayment";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  await connectDB();

  const { id } = await params;

  const order = await RetailOrder.findById(id);

  if (!order) {
    return NextResponse.json(
      {
        message: "Order not found",
      },
      {
        status: 404,
      },
    );
  }

  const payment = await RetailPayment.findOne({
    orderId: id,
  });

  return NextResponse.json({
    orderStatus: order.status,
    paymentStatus: payment?.status ?? null,
  });
}
