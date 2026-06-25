import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { requireAuth } from "../../../lib/requireAuth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const user = requireAuth(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [allianceResult, settingsResult] = await Promise.all([
    supabase
      .from("alliances")
      .select("id, name, tag, server")
      .eq("id", user.allianceId)
      .single(),

    supabase
      .from("settings")
      .select("*")
      .eq("alliance_id", user.allianceId)
      .single(),
  ]);

  if (allianceResult.error || settingsResult.error) {
    return NextResponse.json(
      {
        error: allianceResult.error?.message ?? settingsResult.error?.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    alliance: allianceResult.data,
    settings: settingsResult.data,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const user = requireAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { alliance, passwords, settings } = await req.json();

    const allianceResult = await supabase
      .from("alliances")
      .update({
        name: alliance.name,
        tag: alliance.tag,
        server: alliance.server,
      })
      .eq("id", user.allianceId);

    if (allianceResult.error) {
      return NextResponse.json(
        { error: allianceResult.error.message },
        { status: 500 },
      );
    }

    const settingsResult = await supabase
      .from("settings")
      .update({
        start_date: settings.start_date,
        minimum_mode: settings.minimum_mode,
        start_requirements: settings.start_requirements,
        scale: settings.scale,
        scale_duration: settings.scale_duration || null,
        end_game_mode: settings.end_game_mode,
        max_requirements: settings.max_requirements,
      })
      .eq("alliance_id", user.allianceId);

    if (settingsResult.error) {
      return NextResponse.json(
        { error: settingsResult.error.message },
        { status: 500 },
      );
    }

    if (passwords?.viewer || passwords?.admin) {
      const passwordUpdate: Record<string, string> = {};

      if (passwords.viewer?.trim()) {
        passwordUpdate.viewer_password_hash = await bcrypt.hash(
          passwords.viewer,
          12,
        );
      }

      if (passwords.admin?.trim()) {
        passwordUpdate.admin_password_hash = await bcrypt.hash(
          passwords.admin,
          12,
        );
      }

      const passwordResult = await supabase
        .from("alliance_access")
        .update(passwordUpdate)
        .eq("alliance_id", user.allianceId);

      if (passwordResult.error) {
        return NextResponse.json(
          { error: passwordResult.error.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
