import { NextResponse } from "next/server";
import { verifyRetailToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import RetailWallet from "@/models/RetailWallet";
import RetailUser from "@/models/RetailUser";

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const token = cookie
      .split(";")
      .find((c) => c.trim().startsWith("retailToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyRetailToken(token);

    const user = await RetailUser.findById(decoded.userId).select("name email");

    const wallet = await RetailWallet.findOne({
      retailUserId: decoded.userId,
    });

    return NextResponse.json({
      user: {
        id: decoded.userId,
        name: user?.name,
        email: user?.email,
        balance: wallet?.balance ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
