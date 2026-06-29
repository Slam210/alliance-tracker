import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { allianceId, weekName, date } = await req.json();

    if (!allianceId || !weekName) {
      return NextResponse.json(
        { error: "Missing allianceId or weekName." },
        { status: 400 },
      );
    }

    const srWeek = Number(weekName.replace("SR", ""));

    if (Number.isNaN(srWeek)) {
      return NextResponse.json(
        { error: "Invalid week name." },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("state_rulers")
      .update({ "sr_date": date ?? null })
      .eq("alliance_id", allianceId)
      .eq("sr_week", srWeek);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
