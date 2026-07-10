import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { signRetailToken } from "@/lib/auth";
import RetailUser from "@/models/RetailUser";
import RetailWallet from "@/models/RetailWallet";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await RetailUser.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const wallet = await RetailWallet.findOne({
      retailUserId: user._id,
    });

    const token = signRetailToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const res = NextResponse.json({
      message: "Logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: wallet?.balance ?? 0,
      },
    });

    res.cookies.set("retailToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
