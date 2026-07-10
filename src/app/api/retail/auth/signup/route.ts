import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { signRetailToken } from "@/lib/auth";
import RetailUser from "@/models/RetailUser";
import RetailWallet from "@/models/RetailWallet";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await RetailUser.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await RetailUser.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await RetailWallet.create({
      retailUserId: user._id,
      balance: 0,
    });

    // Auto login
    const token = signRetailToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const res = NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          balance: 10,
        },
      },
      { status: 201 },
    );

    res.cookies.set("retailToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
