import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { requireAuth } from "../../../../lib/requireAuth";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const body = await req.json();

    const args = {
      p_alliance_id: user.allianceId,
      p_member_id: body.id,
      p_type: body.type,
      p_sr_week: body.sr_week.replace("SR", ""),
      p_progress_rank: body.progressRank ?? null,
      p_progress_score: body.progressScore ?? null,
      p_clash_rank: body.clashRank ?? null,
      p_clash_score: body.clashScore ?? null,
    };

    const { data, error } = await supabase.rpc("submit_state_ruler", args);

    if (error) {
      console.error(error);

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to submit state ruler" },
      { status: 500 },
    );
  }
}
