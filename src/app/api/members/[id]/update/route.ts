import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/requireAuth";
import { supabase } from "../../../../../lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireAuth(req);

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const { status, name, nickname, timezone, display_name, eos_reward } =
      await req.json();

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (name !== undefined) {
      updates.name = name;
    }

    if (nickname !== undefined) {
      updates.nickname = nickname;
    }

    if (timezone !== undefined) {
      updates.timezone = timezone;
    }

    if (display_name !== undefined) {
      updates.display_name = display_name;
    }

    if (eos_reward !== undefined) {
      updates.eos_reward = eos_reward;
    }

    const { data, error } = await supabase
      .from("members")
      .update(updates)
      .eq("id", id)
      .eq("alliance_id", user.allianceId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    );
  }
}
