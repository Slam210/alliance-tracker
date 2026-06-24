import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { data, error } = await supabase.rpc("get_all_alliance_duel_weeks", {
      p_alliance_id: user.allianceId,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to load alliance duel weeks" },
      { status: 500 },
    );
  }
}
