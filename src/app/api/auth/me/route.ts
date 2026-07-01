import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/auth";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, role: null }, { status: 401 });
  }

  try {
    const user = verifyToken(token);

    return NextResponse.json({
      authenticated: true,
      allianceId: user.allianceId,
      role: user.role,
    });
  } catch {
    return NextResponse.json({ authenticated: false, role: null }, { status: 401 });
  }
}
