import { NextRequest, NextResponse } from "next/server";
import { getDayKey } from "../../../../features/AlliianceDuel/utils/getDayKey";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";
import { getWeekNumber } from "../../../../services/api";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const body = await req.json();

    const { id, entryType, date, points, exception } = body;

    if (!id || !entryType || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const weekNumber = getWeekNumber(date);
    const day = getDayKey(new Date(date));

    const { data, error } = await supabase.rpc("submit_alliance_duel", {
      p_alliance_id: user.allianceId,
      p_member_id: id,
      p_entry_type: entryType,
      p_week_number: weekNumber,
      p_day: day,
      p_points: points,
      p_exception: exception,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to submit duel entry: ${err}` },
      { status: 500 },
    );
  }
}
