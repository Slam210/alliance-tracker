import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "../../../../lib/supabase";
import { createToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { name, tag, password } = await req.json();

    if (!name || !tag || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: alliance, error: allianceError } = await supabase
      .from("alliances")
      .select("id")
      .eq("name", name)
      .eq("tag", tag)
      .single();

    if (allianceError || !alliance) {
      return NextResponse.json(
        { error: "Alliance not found" },
        { status: 404 },
      );
    }

    const { data: access, error: accessError } = await supabase
      .from("alliance_access")
      .select("viewer_password_hash, admin_password_hash")
      .eq("alliance_id", alliance.id)
      .single();

    if (accessError || !access) {
      return NextResponse.json(
        { error: "Access configuration missing" },
        { status: 500 },
      );
    }

    const isAdmin = await bcrypt.compare(password, access.admin_password_hash);

    const isViewer = await bcrypt.compare(
      password,
      access.viewer_password_hash,
    );

    const role = isAdmin ? "admin" : isViewer ? "viewer" : null;

    if (!role) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createToken({
      allianceId: alliance.id,
      role,
    });

    const response = NextResponse.json({
      success: true,
      role,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
