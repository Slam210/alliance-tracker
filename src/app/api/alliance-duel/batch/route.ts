import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";
import { getWeekNumber } from "../../../../utils/week";
import { getEventKey } from "../../../../constants/week";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const entries = await req.json();

    if (!Array.isArray(entries)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payload = entries.map((entry) => ({
      member_id: entry.id,
      week_number: getWeekNumber(entry.date),
      event: getEventKey(new Date(entry.date)),
      points: entry.points,
      exception: entry.exception,
    }));

    const { data, error } = await supabase.rpc("submit_alliance_duel_batch", {
      p_alliance_id: user.allianceId,
      p_entries: payload,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to submit batch duel entries: ${err}` },
      { status: 500 },
    );
  }
}
