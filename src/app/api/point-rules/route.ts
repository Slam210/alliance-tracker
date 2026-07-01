import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { requireAuth } from "../../../lib/requireAuth";
import { PointRuleUpdatePayload } from "../../../features/Settings/hooks/usePointRules";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const allianceId = auth.allianceId;

    const { data, error } = await supabase
      .from("point_rules")
      .select(
        `
        id,
        system,
        type,
        min_rank,
        max_rank,
        requires_requirement,
        points
      `
      )
      .eq("alliance_id", allianceId)
      .order("system")
      .order("type");

    if (error) throw error;

    const result = (data ?? []).map((rule) => ({
      id: rule.id,
      system: rule.system,
      type: rule.type,
      minRank: rule.min_rank,
      maxRank: rule.max_rank,
      requiresRequirement: rule.requires_requirement,
      points: rule.points,
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch point rules: ${err}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const allianceId = auth.allianceId;

    const body: PointRuleUpdatePayload = await req.json();

    // 1. DELETE
    if (body.deleted.length > 0) {
      const { error: deleteError } = await supabase
        .from("point_rules")
        .delete()
        .eq("alliance_id", allianceId)
        .in("id", body.deleted);

      if (deleteError) throw deleteError;
    }

    // 2. UPDATE
    for (const rule of body.updated) {
      if (!rule.id) continue;

      const { error } = await supabase
        .from("point_rules")
        .update({
          system: rule.system,
          type: rule.type,
          min_rank: rule.minRank,
          max_rank: rule.maxRank,
          requires_requirement: rule.requiresRequirement,
          points: rule.points,
        })
        .eq("id", rule.id)
        .eq("alliance_id", allianceId);

      if (error) throw error;
    }

    // 3. INSERT
    if (body.added.length > 0) {
      const inserts = body.added.map((rule) => ({
        alliance_id: allianceId,
        system: rule.system,
        type: rule.type,
        min_rank: rule.minRank,
        max_rank: rule.maxRank,
        requires_requirement: rule.requiresRequirement,
        points: rule.points,
      }));

      const { error: insertError } = await supabase
        .from("point_rules")
        .insert(inserts);

      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to update point rules: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    if (auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("point_rules")
      .delete()
      .eq("alliance_id", auth.allianceId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "All point rules deleted",
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to delete point rules: ${err}` },
      { status: 500 }
    );
  }
}
