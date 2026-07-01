import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";
import { getWeekNumber } from "../../../../utils/week";
import { getEventKey } from "../../../../constants/week";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const body = await req.json();

    const { date, startDate } = body;

    if (!date) {
      return NextResponse.json({ error: "Missing field" }, { status: 400 });
    }

    const weekNumber = getWeekNumber(date, new Date(startDate));
    const event = getEventKey(new Date(date), new Date(startDate));

    const { error } = await supabase.rpc("build_duel_scores_event", {
      p_alliance_id: user.allianceId,
      p_week_number: weekNumber,
      p_event: event,
    });

    if (error) throw error;

    return NextResponse.json({ message: "Duel event updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : JSON.stringify(err),
      },
      { status: 500 },
    );
  }
}
