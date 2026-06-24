import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "../../../../lib/supabase";
import { createToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { name, tag, server, viewerPassword, adminPassword } =
      await req.json();

    if (!name || !tag || !viewerPassword || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if alliance already exists
    const { data: existing } = await supabase
      .from("alliances")
      .select("id")
      .eq("name", name)
      .eq("tag", tag)
      .eq("server", server)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Alliance already exists" },
        { status: 409 },
      );
    }

    // Create alliance
    const { data: alliance, error: allianceError } = await supabase
      .from("alliances")
      .insert({
        name,
        tag,
        server,
      })
      .select()
      .single();

    if (allianceError) {
      throw allianceError;
    }

    // Hash passwords
    const viewerHash = await bcrypt.hash(viewerPassword, 10);

    const adminHash = await bcrypt.hash(adminPassword, 10);

    // Create access row
    const { error: accessError } = await supabase
      .from("alliance_access")
      .insert({
        alliance_id: alliance.id,
        viewer_password_hash: viewerHash,
        admin_password_hash: adminHash,
      });

    if (accessError) {
      throw accessError;
    }

    // Create default settings row
    const { error: settingsError } = await supabase.from("settings").insert({
      alliance_id: alliance.id,
      start_date: new Date().toISOString().split("T")[0],
      scale: false,
      start_min: [],
      max_min: [],
      scale_duration: 0,
    });

    if (settingsError) {
      throw settingsError;
    }

    const token = createToken({
      allianceId: alliance.id,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create alliance" },
      { status: 500 },
    );
  }
}
