import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: "admin@deblocar.com",
    });

    if (existingUser) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      email: "admin@deblocar.com",
      name: "deblocar",
      password: hashedPassword,
    });

    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();
