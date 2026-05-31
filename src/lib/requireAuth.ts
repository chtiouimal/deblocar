import { verifyToken } from "./auth";

export function requireAuth(req: Request) {
  const cookie = req.headers.get("cookie");

  if (!cookie) return null;

  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}