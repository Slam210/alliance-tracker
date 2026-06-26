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

    const viewerHash = passwords?.viewer?.trim()
      ? await bcrypt.hash(passwords.viewer, 12)
      : null;

    const adminHash = passwords?.admin?.trim()
      ? await bcrypt.hash(passwords.admin, 12)
      : null;

    const { error } = await supabase.rpc("update_alliance_settings", {
      p_alliance_id: user.allianceId,
      p_alliance: alliance,
      p_settings: settings,
      p_viewer_password_hash: viewerHash,
      p_admin_password_hash: adminHash,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error?.message,
        },
        { status: 500 },
      );
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
