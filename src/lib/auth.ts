import jwt from "jsonwebtoken";
export interface RetailJwtPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
}

export function signToken(payload: RetailJwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): RetailJwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as RetailJwtPayload;
}

export function signRetailToken(payload: RetailJwtPayload) {
  return jwt.sign(payload, process.env.JWT_RETAIL_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyRetailToken(token: string): RetailJwtPayload {
  return jwt.verify(token, process.env.JWT_RETAIL_SECRET!) as RetailJwtPayload;
}