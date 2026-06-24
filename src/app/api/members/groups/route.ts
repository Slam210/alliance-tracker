import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/requireAuth";
import { supabase } from "../../../../lib/supabase";

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = await req.json();

    if (!Array.isArray(members)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updates = members.map((member) => ({
      id: member.id,
      alliance_id: user.allianceId,
      group_number: member.group_number ?? null,
      group_leader: member.group_leader ?? false,
    }));

    const { error } = await supabase.from("members").upsert(updates, {
      onConflict: "id",
    });

    if (error) throw error;

    return NextResponse.json({
      status: "Group information assigned",
      updated: updates.length,
    });
  } catch (err) {
    return NextResponse.json({ error: `Failed to update groups: ${err}` }, { status: 500 });
  }
}
