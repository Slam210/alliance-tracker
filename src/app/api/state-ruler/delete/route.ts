import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { weekId, memberId } = await req.json();

    console.log(weekId, memberId)

    // Delete ALL weeks
    if (!weekId) {
      const { data: weeks, error: weeksError } = await supabase
        .from("state_rulers")
        .select("id")
        .eq("alliance_id", user.allianceId);

      if (weeksError) throw weeksError;

      const ids = weeks.map((w) => w.id);

      if (ids.length) {
        const { error: entriesError } = await supabase
          .from("state_ruler_entries")
          .delete()
          .in("state_ruler_id", ids);

        if (entriesError) throw entriesError;
      }

      const { error } = await supabase
        .from("state_rulers")
        .delete()
        .eq("alliance_id", user.allianceId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        mode: "all",
      });
    }

    // Find the requested week
    const { data: stateRuler, error: lookupError } = await supabase
      .from("state_rulers")
      .select("id")
      .eq("alliance_id", user.allianceId)
      .eq("sr_week", weekId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (!stateRuler) {
      return NextResponse.json(
        { error: "Week not found" },
        { status: 404 }
      );
    }

    // Delete one member's entry
    if (memberId) {
      const { error } = await supabase
        .from("state_ruler_entries")
        .delete()
        .eq("state_ruler_id", stateRuler.id)
        .eq("member_id", memberId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        mode: "entry",
      });
    }

    // Delete the entire week
    const { error: entriesError } = await supabase
      .from("state_ruler_entries")
      .delete()
      .eq("state_ruler_id", stateRuler.id);

    if (entriesError) throw entriesError;

    const { error } = await supabase
      .from("state_rulers")
      .delete()
      .eq("id", stateRuler.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      mode: "week",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete State Ruler data" },
      { status: 500 }
    );
  }
}
