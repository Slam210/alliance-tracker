import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);

    let body = {};

    try {
      body = await req.json();
    } catch {
      // No body provided
    }

    const { weekNumber, event, memberId } = body as {
      weekNumber?: number;
      event?: string;
      memberId?: string;
    };

    const { error } = await supabase.rpc("delete_duel_data", {
      p_alliance_id: user.allianceId,
      p_week_number: weekNumber ?? null,
      p_event: event ?? null,
      p_member_id: memberId ?? null,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to delete duel data" },
      { status: 500 },
    );
  }
}
