import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";
import { getWeekNumber } from "../../../../utils/week";
import { getEventKey } from "../../../../constants/week";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const body = await req.json();

    const { id, date, points, exception } = body;

    if (!id || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const weekNumber = getWeekNumber(date);
    const event = getEventKey(new Date(date));

    const { data, error } = await supabase.rpc("submit_alliance_duel", {
      p_alliance_id: user.allianceId,
      p_member_id: id,
      p_week_number: weekNumber,
      p_event: event,
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
