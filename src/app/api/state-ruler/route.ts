import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/requireAuth";
import { supabase } from "../../../lib/supabase";
import { StateRulerInfractionUI, StateRulerResponse } from "../../../types/stateRuler";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    // Fetch SR entries
    const { data, error } = await supabase
      .from("state_rulers")
      .select(
        `
        id,
        sr_week,
        sr_date,
        state_ruler_entries (
          member_id,
          progress_rank,
          progress_score,
          clash_rank,
          clash_score
        )
      `
      )
      .eq("alliance_id", user.allianceId)
      .order("sr_week");

    if (error) throw error;

    // 2. Fetch infractions from VIEW
    const { data: infractionsData, error: infError } = await supabase
      .from("state_ruler_infractions_view")
      .select(
        `
        state_ruler_id,
        member_id,
        infraction_type_id,
        infraction,
        points,
        notes
      `
      );

    if (infError) throw infError;

    // Group infractions by (state_ruler_id + member_id)
    const infractionsMap = new Map<string, StateRulerInfractionUI[]>();

    for (const inf of infractionsData ?? []) {
      const key = `${inf.state_ruler_id}:${inf.member_id}`;

      if (!infractionsMap.has(key)) {
        infractionsMap.set(key, []);
      }

      infractionsMap.get(key)!.push({
        id: inf.infraction_type_id,
        infraction: inf.infraction,
        points: inf.points,
        notes: inf.notes,
      });
    }

    // Build response
    const result: StateRulerResponse = {};

    for (const sr of data ?? []) {
      result[`SR${sr.sr_week}`] = {
        date: sr.sr_date,
        rows: (sr.state_ruler_entries ?? []).map((entry) => {
          const key = `${sr.id}:${entry.member_id}`;

          return {
            id: entry.member_id,

            progressRank: entry.progress_rank,
            progressScore: entry.progress_score,

            clashRank: entry.clash_rank,
            clashScore: entry.clash_score,

            infractions: infractionsMap.get(key) ?? [],
          };
        }),
      };
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch State Ruler data" },
      { status: 500 }
    );
  }
}
