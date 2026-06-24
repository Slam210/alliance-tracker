import jwt from "jsonwebtoken";

export type AuthPayload = {
  allianceId: string;
  role: "viewer" | "admin";
};

export function createToken(payload: AuthPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
}
