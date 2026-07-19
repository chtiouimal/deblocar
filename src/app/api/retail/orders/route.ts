import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireRetailAuth } from "@/lib/requireAuth";

import RetailUser from "@/models/RetailUser";
import RetailWallet from "@/models/RetailWallet";
import RetailOrder from "@/models/RetailOrder";
import RetailOrderItem, {
  RetailOrderItemStatus,
} from "@/models/RetailOrderItem";
import RetailTokenTransaction, {
  TokenTransactionType,
} from "@/models/RetailTokenTransaction";

import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const auth = requireRetailAuth(req);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          message: "No items provided",
        },
        { status: 400 },
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

    /*
      Get MBTools parameters once
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
      Prepare order items
    */

    let totalTokens = 0;

    const preparedItems = items.map((item: any) => {
      const selectedHu = parameters.find((p: any) => p.shortName === item.hu);

      if (!selectedHu) {
        throw new Error(`Invalid HU ${item.hu}`);
      }

      totalTokens += selectedHu.tokenCost;

      return {
        ...item,
        ntgName: selectedHu.ntgName,
        displayName: selectedHu.displayName,
        tokenCost: selectedHu.tokenCost,
      };
    });

    /*
      Check balance
    */

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

    const balanceBefore = wallet.balance;

    /*
      Create Order
    */

    const order = await RetailOrder.create({
      retailUserId: auth.userId,

      totalItems: preparedItems.length,

      totalTokens,

      balanceBefore,

      balanceAfter: balanceBefore - totalTokens,

      status: "processing",
    });

    /*
      Create Order Items
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
      Generate all pins
    */

    const apiKey = process.env.MBTOOLS_API_KEY;

    const results = await Promise.all(
      orderItems.map(async (orderItem) => {
        try {
          const params = new URLSearchParams({
            hu: orderItem.hu,

            region: orderItem.region,

            version: orderItem.version,

            vin: orderItem.vin,

            apiKey: apiKey!,
          });

          const response = await fetch(`https://api.mbtools.com/map?${params}`);

          if (!response.ok) {
            throw new Error("Generation failed");
          }

          const data = await response.json();

          await RetailOrderItem.findByIdAndUpdate(orderItem._id, {
            pin: data.pin,
            status: RetailOrderItemStatus.SUCCESS,
          });

          return {
            ...orderItem.toObject(),
            pin: data.pin,
          };
        } catch (error: any) {
          await RetailOrderItem.findByIdAndUpdate(orderItem._id, {
            status: RetailOrderItemStatus.FAILED,
            error: error.message,
          });

          return null;
        }
      }),
    );

    /*
      Deduct wallet
    */

    wallet.balance -= totalTokens;

    await wallet.save();

    /*
      Create transaction
    */

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

    order.status = "completed";

    await order.save();

    /*
      Send ONE email
    */

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: user.email,

      subject: "Vos codes PIN Mercedes-Benz",

      text: `
Bonjour ${user.name},

Votre commande a été générée avec succès.

${results
  .filter(Boolean)
  .map(
    (item: any) => `

Système: ${item.ntgName}

Région: ${item.region}

Version: ${item.version}

VIN: ${item.vin}

PIN: ${item.pin}

`,
  )
  .join("\n")}


Tokens utilisés: ${totalTokens}

Solde restant: ${wallet.balance}


Merci.
`,
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
