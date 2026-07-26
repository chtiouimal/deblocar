// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { requireRetailAuth } from "@/lib/requireAuth";

// import RetailUser from "@/models/RetailUser";
// import RetailWallet from "@/models/RetailWallet";
// import RetailOrder, { RetailOrderStatus } from "@/models/RetailOrder";
// import RetailOrderItem, {
//   RetailOrderItemStatus,
// } from "@/models/RetailOrderItem";
// import RetailTokenTransaction, {
//   TokenTransactionType,
// } from "@/models/RetailTokenTransaction";

// import { transporter } from "@/lib/mailer";
// import { orderEmailTemplate } from "@/templates/orderEmailTemplate";

// export async function POST(req: Request) {
//   try {
//     const auth = requireRetailAuth(req);

//     if (!auth) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     await connectDB();

//     const body = await req.json();

//     const { items } = body;

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return NextResponse.json(
//         {
//           message: "No items provided",
//         },
//         { status: 400 },
//       );
//     }

//     const user = await RetailUser.findById(auth.userId).select("email name");

//     if (!user) {
//       return NextResponse.json(
//         {
//           message: "User not found",
//         },
//         {
//           status: 404,
//         },
//       );
//     }

//     const wallet = await RetailWallet.findOne({
//       retailUserId: auth.userId,
//     });

//     if (!wallet) {
//       return NextResponse.json(
//         {
//           message: "Wallet not found",
//         },
//         {
//           status: 404,
//         },
//       );
//     }

//     /*
//       Get MBTools parameters once
//     */

//     const parametersResponse = await fetch("https://api.mbtools.com/map", {
//       headers: {
//         Accept: "application/json",
//       },
//     });

//     if (!parametersResponse.ok) {
//       return NextResponse.json(
//         {
//           message: "Unable to fetch parameters",
//         },
//         {
//           status: 500,
//         },
//       );
//     }

//     const parameters = await parametersResponse.json();

//     /*
//       Prepare order items
//     */

//     let totalTokens = 0;

//     const preparedItems = items.map((item: any) => {
//       const selectedHu = parameters.find((p: any) => p.shortName === item.hu);

//       if (!selectedHu) {
//         throw new Error(`Invalid HU ${item.hu}`);
//       }

//       totalTokens += selectedHu.tokenCost;

//       return {
//         ...item,
//         ntgName: selectedHu.ntgName,
//         displayName: selectedHu.displayName,
//         tokenCost: selectedHu.tokenCost,
//       };
//     });

//     /*
//       Check balance
//     */

//     if (wallet.balance < totalTokens) {
//       return NextResponse.json(
//         {
//           message: "Insufficient tokens",
//           balance: wallet.balance,
//           required: totalTokens,
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     const balanceBefore = wallet.balance;

//     /*
//       Create Order
//     */

//     const order = await RetailOrder.create({
//       retailUserId: auth.userId,

//       totalItems: preparedItems.length,

//       totalTokens,

//       balanceBefore,

//       balanceAfter: balanceBefore - totalTokens,

//       status: "processing",
//     });

//     /*
//       Create Order Items
//     */

//     const orderItems = await RetailOrderItem.insertMany(
//       preparedItems.map((item: any) => ({
//         orderId: order._id,

//         hu: item.hu,

//         ntgName: item.ntgName,

//         displayName: item.displayName,

//         region: item.region,
//         regionName: item.regionName ?? item.region,

//         version: item.version,
//         versionName: item.versionName ?? item.version,

//         vin: item.vin,

//         tokenCost: item.tokenCost,

//         status: RetailOrderItemStatus.PENDING,
//       })),
//     );

//     /*
//       Generate all pins
//     */

//     const apiKey = process.env.MBTOOLS_API_KEY;

//     const results = await Promise.all(
//       orderItems.map(async (orderItem) => {
//         try {
//           const params = new URLSearchParams({
//             hu: orderItem.hu,

//             region: orderItem.region,

//             version: orderItem.version,

//             vin: orderItem.vin,

//             apiKey: apiKey!,
//           });

//           const response = await fetch(`https://api.mbtools.com/map?${params}`);

//           if (!response.ok) {
//             throw new Error("Generation failed");
//           }

//           const data = await response.json();

//           await RetailOrderItem.findByIdAndUpdate(orderItem._id, {
//             pin: data.pin,
//             status: RetailOrderItemStatus.SUCCESS,
//           });

//           return {
//             ...orderItem.toObject(),
//             pin: data.pin,
//           };
//         } catch (error: any) {
//           await RetailOrderItem.findByIdAndUpdate(orderItem._id, {
//             status: RetailOrderItemStatus.FAILED,
//             error: error.message,
//           });

//           return null;
//         }
//       }),
//     );

//     /*
//       Deduct wallet
//     */

//     wallet.balance -= totalTokens;

//     await wallet.save();

//     /*
//       Create transaction
//     */

//     const transaction = await RetailTokenTransaction.create({
//       retailUserId: auth.userId,

//       type: TokenTransactionType.CONSUME,

//       amount: totalTokens,

//       balanceBefore,

//       balanceAfter: wallet.balance,

//       orderId: order._id,

//       note: `Order #${order._id}`,
//     });

//     order.transactionId = transaction._id;

//     const successCount = results.filter(Boolean).length;

//     if (successCount === preparedItems.length) {
//       order.status = RetailOrderStatus.COMPLETED;
//     } else if (successCount === 0) {
//       order.status = RetailOrderStatus.FAILED;
//     } else {
//       order.status = RetailOrderStatus.PARTIAL;
//     }

//     await order.save();

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,

//       to: user.email,

//       subject: "Commande Mercedes-Benz - Deblocar",

//       html: orderEmailTemplate({
//         name: user.name,

//         orderId: order._id,

//         items: results.filter(Boolean),

//         totalItems: preparedItems.length,

//         totalTokens,

//         balance: wallet.balance,
//       }),
//     });

//     return NextResponse.json({
//       message: "Order completed",

//       orderId: order._id,

//       balance: wallet.balance,
//     });
//   } catch (error: any) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: error.message || "Server error",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

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
