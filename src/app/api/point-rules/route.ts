import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { requireAuth } from "../../../lib/requireAuth";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);

    const { data, error } = await supabase
      .from("point_rules")
      .select(
        `
        system,
        type,
        min_rank,
        max_rank,
        requires_requirement,
        points
      `,
      )
      .order("system")
      .order("type");

    if (error) throw error;

    const result = (data ?? []).map((rule) => ({
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
      { status: 500 },
    );
  }
}
