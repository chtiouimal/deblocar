import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";

import RetailOrder from "@/models/RetailOrder";
import RetailOrderItem from "@/models/RetailOrderItem";
import RetailPayment from "@/models/RetailPayment";
import RetailTokenTransaction from "@/models/RetailTokenTransaction";
import RetailUser from "@/models/RetailUser";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);

    if (!auth) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.max(Number(searchParams.get("limit") ?? 10), 1);

    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");

    const filter: any = {
      $or: [
        {
          paymentId: {
            $exists: true,
            $ne: null,
          },
        },
        {
          transactionId: {
            $exists: true,
            $ne: null,
          },
        },
      ],
    };

    if (status) {
      filter.status = status;
    }

    /*
      Search client
    */

    if (search) {
      const users = await RetailUser.find({
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      })
        .select("_id")
        .lean();

      filter.retailUserId = {
        $in: users.map((u) => u._id),
      };
    }

    const [orders, total] = await Promise.all([
      RetailOrder.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      RetailOrder.countDocuments(filter),
    ]);

    const orderIds = orders.map((o: any) => o._id);

    const paymentIds = orders
      .filter((o: any) => o.paymentId)
      .map((o: any) => o.paymentId);

    const transactionIds = orders
      .filter((o: any) => o.transactionId)
      .map((o: any) => o.transactionId);

    const userIds = orders.map((o: any) => o.retailUserId);

    const [items, payments, transactions, users] = await Promise.all([
      RetailOrderItem.find({
        orderId: {
          $in: orderIds,
        },
      }).lean(),

      paymentIds.length
        ? RetailPayment.find({
            _id: {
              $in: paymentIds,
            },
          }).lean()
        : [],

      transactionIds.length
        ? RetailTokenTransaction.find({
            _id: {
              $in: transactionIds,
            },
          }).lean()
        : [],

      RetailUser.find({
        _id: {
          $in: userIds,
        },
      })
        .select("name email")
        .lean(),
    ]);

    const itemsMap = new Map<string, any[]>();

    for (const item of items) {
      const key = item.orderId.toString();

      if (!itemsMap.has(key)) {
        itemsMap.set(key, []);
      }

      itemsMap.get(key)!.push(item);
    }

    const paymentMap = new Map(
      payments.map((payment: any) => [payment._id.toString(), payment]),
    );

    const transactionMap = new Map(
      transactions.map((transaction: any) => [
        transaction._id.toString(),
        transaction,
      ]),
    );

    const userMap = new Map(
      users.map((user: any) => [user._id.toString(), user]),
    );

    const data = orders.map((order: any) => ({
      ...order,

      retailUser: userMap.get(order.retailUserId.toString()) ?? null,

      items: itemsMap.get(order._id.toString()) ?? [],

      payment: order.paymentId
        ? (paymentMap.get(order.paymentId.toString()) ?? null)
        : null,

      transaction: order.transactionId
        ? (transactionMap.get(order.transactionId.toString()) ?? null)
        : null,
    }));

    return NextResponse.json({
      data,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message || "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
