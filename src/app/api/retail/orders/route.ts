import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { requireRetailAuth } from "@/lib/requireAuth";

import RetailUser from "@/models/RetailUser";
import RetailWallet from "@/models/RetailWallet";

import RetailOrder, {
  RetailOrderStatus,
  RetailPaymentMethod,
} from "@/models/RetailOrder";

import RetailOrderItem, {
  RetailOrderItemStatus,
} from "@/models/RetailOrderItem";

import RetailTokenTransaction, {
  TokenTransactionType,
} from "@/models/RetailTokenTransaction";

import RetailPayment, { RetailPaymentStatus } from "@/models/RetailPayment";

import { transporter } from "@/lib/mailer";
import { orderEmailTemplate } from "@/templates/orderEmailTemplate";

import { generateOrderPins } from "@/lib/retail/generateOrderPins";

import { TOKEN_PRICES } from "@/constants/tokenPrices";

import { stripe } from "@/lib/stripe";
import { convertTndToEuro } from "@/lib/currency";

export async function POST(req: Request) {
  try {
    const auth = requireRetailAuth(req);

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

    const body = await req.json();

    const { items, paymentMethod = RetailPaymentMethod.TOKENS } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          message: "No items provided",
        },
        {
          status: 400,
        },
      );
    }

    const user = await RetailUser.findById(auth.userId).select("email name");

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const wallet = await RetailWallet.findOne({
      retailUserId: auth.userId,
    });

    /*
      Get parameters
    */

    const parametersResponse = await fetch("https://api.mbtools.com/map", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!parametersResponse.ok) {
      return NextResponse.json(
        {
          message: "Unable to fetch parameters",
        },
        {
          status: 500,
        },
      );
    }

    const parameters = await parametersResponse.json();

    /*
      Prepare items
    */

    let totalTokens = 0;

    let totalPrice = 0;

    const preparedItems = items.map((item: any) => {
      const selectedHu = parameters.find((p: any) => p.shortName === item.hu);

      if (!selectedHu) {
        throw new Error(`Invalid HU ${item.hu}`);
      }

      const price = TOKEN_PRICES[selectedHu.tokenCost];

      if (!price) {
        throw new Error(`Missing price for ${selectedHu.tokenCost}`);
      }

      totalTokens += selectedHu.tokenCost;

      totalPrice += price;

      return {
        ...item,

        ntgName: selectedHu.ntgName,

        displayName: selectedHu.displayName,

        tokenCost: selectedHu.tokenCost,
      };
    });

    const balanceBefore = wallet?.balance ?? 0;

    /*
      Token balance check
      only for token payments
    */

    if (paymentMethod === RetailPaymentMethod.TOKENS) {
      if (!wallet) {
        return NextResponse.json(
          {
            message: "Wallet not found",
          },
          {
            status: 404,
          },
        );
      }
      if (wallet.balance < totalTokens) {
        return NextResponse.json(
          {
            message: "Insufficient tokens",

            balance: wallet.balance,

            required: totalTokens,
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
      Create order
    */

    const order = await RetailOrder.create({
      retailUserId: auth.userId,

      totalItems: preparedItems.length,

      totalTokens,

      totalPrice,

      paymentMethod,

      balanceBefore,

      balanceAfter:
        paymentMethod === RetailPaymentMethod.TOKENS
          ? balanceBefore - totalTokens
          : balanceBefore,

      status:
        paymentMethod === RetailPaymentMethod.CARD
          ? RetailOrderStatus.PENDING
          : RetailOrderStatus.PROCESSING,
    });

    /*
      Create items
    */

    const orderItems = await RetailOrderItem.insertMany(
      preparedItems.map((item: any) => ({
        orderId: order._id,

        hu: item.hu,

        ntgName: item.ntgName,

        displayName: item.displayName,

        region: item.region,

        regionName: item.regionName ?? item.region,

        version: item.version,

        versionName: item.versionName ?? item.version,

        vin: item.vin,

        tokenCost: item.tokenCost,

        status: RetailOrderItemStatus.PENDING,
      })),
    );

    /*
      CARD PAYMENT
    */

    if (paymentMethod === RetailPaymentMethod.CARD) {
      const euroAmount = convertTndToEuro(totalPrice);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(euroAmount * 100),

        currency: "eur",

        payment_method_types: ["card"],

        metadata: {
          orderId: order._id.toString(),

          userId: auth.userId.toString(),
        },
      });

      await RetailPayment.create({
        retailUserId: auth.userId,

        orderId: order._id,

        stripePaymentIntentId: paymentIntent.id,

        amount: euroAmount,

        currency: "eur",

        status: RetailPaymentStatus.PENDING,
      });

      return NextResponse.json({
        paymentRequired: true,

        clientSecret: paymentIntent.client_secret,

        orderId: order._id,
      });
    }

    /*
      TOKEN PAYMENT
    */

    const results = await generateOrderPins(orderItems);

    wallet.balance -= totalTokens;

    await wallet.save();

    const transaction = await RetailTokenTransaction.create({
      retailUserId: auth.userId,

      type: TokenTransactionType.CONSUME,

      amount: totalTokens,

      balanceBefore,

      balanceAfter: wallet.balance,

      orderId: order._id,

      note: `Order #${order._id}`,
    });

    order.transactionId = transaction._id;

    const successCount = results.filter(Boolean).length;

    if (successCount === preparedItems.length) {
      order.status = RetailOrderStatus.COMPLETED;
    } else if (successCount === 0) {
      order.status = RetailOrderStatus.FAILED;
    } else {
      order.status = RetailOrderStatus.PARTIAL;
    }

    await order.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: user.email,

      subject: "Commande Mercedes-Benz - Deblocar",

      html: orderEmailTemplate({
        name: user.name,

        orderId: order._id,

        items: results.filter(Boolean),

        totalItems: preparedItems.length,

        totalTokens,

        balance: wallet.balance,
      }),
    });

    return NextResponse.json({
      message: "Order completed",

      orderId: order._id,

      balance: wallet.balance,
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

export async function GET(req: Request) {
  try {
    const auth = requireRetailAuth(req);

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

    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");

    const filter: any = {
      retailUserId: auth.userId,
      $or: [
        {
          paymentId: {
            $ne: null,
          },
        },
        {
          transactionId: {
            $ne: null,
          },
        },
      ],
    };

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    const [orders, total] = await Promise.all([
      RetailOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      RetailOrder.countDocuments(filter),
    ]);

    const orderIds = orders.map((o) => o._id);

    const paymentIds = orders
      .filter((o) => o.paymentId)
      .map((o) => o.paymentId);

    const transactionIds = orders
      .filter((o) => o.transactionId)
      .map((o) => o.transactionId);

    const [orderItems, payments, transactions] = await Promise.all([
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
    ]);

    const itemsMap = new Map<string, any[]>();

    for (const item of orderItems) {
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

    const data = orders.map((order: any) => ({
      ...order,

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
