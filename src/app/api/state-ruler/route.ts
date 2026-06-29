import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/requireAuth";
import { supabase } from "../../../lib/supabase";
import { StateRulerResponse } from "../../../types/stateRuler";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { data, error } = await supabase
      .from("state_rulers")
      .select(
        `
        sr_week,
        sr_date,
        state_ruler_entries (
          member_id,
          progress_rank,
          progress_score,
          clash_rank,
          clash_score
        )
      `,
      )
      .eq("alliance_id", user.allianceId)
      .order("sr_week");

    if (error) {
      throw error;
    }

    const result: StateRulerResponse = {};

    for (const sr of data ?? []) {
      result[`SR${sr.sr_week}`] = {
        date: sr.sr_date,
        rows: (sr.state_ruler_entries ?? []).map((entry) => ({
          id: entry.member_id,

          progressRank: entry.progress_rank,
          progressScore: entry.progress_score,

          clashRank: entry.clash_rank,
          clashScore: entry.clash_score,
        })),
      };
    }

    return NextResponse.json({
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch State Ruler data" },
      { status: 500 },
    );
  }
}
