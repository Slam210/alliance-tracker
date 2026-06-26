import { supabase } from "../../lib/supabase";
import { PointRule } from "../../types/derived/eos";

export async function migratePointRules(
  pointRules: PointRule[],
  alliance_id: string,
) {
  console.log(`Migrating ${pointRules.length} point rules...`);

  const payload = pointRules.map((rule) => ({
    alliance_id,
    system: rule.system,
    type: rule.type,

    min_rank: rule.minRank,
    max_rank: rule.maxRank,

    requires_requirement: rule.requiresRequirement ?? false,

    points: rule.points,
  }));

  const { error } = await supabase.from("point_rules").insert(payload);

  if (error) {
    throw error;
  }

  console.log("✓ Point rules migrated");
}
