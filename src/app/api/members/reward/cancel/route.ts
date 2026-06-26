import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/requireAuth";
import { supabase } from "../../../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing member id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("members")
      .update({
        eos_reward: null,
      })
      .eq("id", id)
      .eq("alliance_id", user.allianceId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "Reward data reset",
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to cancel reward data: ${err}` },
      { status: 500 },
    );
  }
}
