import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";

export function createToken(payload: AuthPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
}
