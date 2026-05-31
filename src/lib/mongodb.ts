import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_URI =
  "mongodb+srv://malek195790:IFtxm483QMXy7xdO@deblocar.wdlkwaa.mongodb.net/deblocar?appName=deblocar";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
