import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function requireAuth(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyToken(token);
}
