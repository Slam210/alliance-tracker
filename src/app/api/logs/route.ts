import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/requireAuth";
import { supabase } from "../../../lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { data } = await supabase
      .from("adjustment_logs_view")
      .select("*")
      .eq("alliance_id", user.allianceId);

    const result = (data ?? []).map((log) => ({
      type: "adjustment",
      logID: log.id,
      memberID: log.member_id,
      name: log.member?.name ?? "",
      nickname: log.member?.nickname ?? "",
      issuedAt: log.issued_at,
      adjustmentType: log.adjustment_type,
      count: log.count,
      points: log.points,
      reason: log.reason,
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch logs: ${err}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { memberID, adjustmentType, count, points, reason } =
      await req.json();

    if (!memberID || !adjustmentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("adjustment_logs").insert({
      alliance_id: user.allianceId,
      member_id: memberID,
      adjustment_type: adjustmentType,
      count,
      points,
      reason,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      status: "Added log",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to add log" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { logID } = await req.json();

    if (!logID) {
      return NextResponse.json({ error: "Missing log id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("adjustment_logs")
      .delete()
      .eq("id", logID)
      .eq("alliance_id", user.allianceId)
      .select();

    if (error) {
      throw error;
    }

    if (!data?.length) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete log" },
      { status: 500 },
    );
  }
}
