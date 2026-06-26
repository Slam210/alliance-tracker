import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { requireAuth } from "../../../lib/requireAuth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("alliance_id", user.allianceId);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, nickname = "" } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const member = {
      alliance_id: user.allianceId,
      name,
      nickname,
      status: "Active",
      joined_date: new Date().toISOString(),
      reason: "",
      timezone: "",
      display_name: "",
      group_number: null,
      group_leader: false,
      eos_reward: "",
    };

    const { data, error } = await supabase
      .from("members")
      .insert(member)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 },
    );
  }
}
