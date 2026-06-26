import { supabase } from "../../lib/supabase";
import { AdjustmentLog } from "../../types/log";
import { normalize } from "../../utils/migrate";

export async function migrateAdjustmentLogs(
  logs: AdjustmentLog[],
  alliance_id: string,
  memberIdMap: Map<string, string>,
) {
  console.log(`Migrating ${logs.length} adjustment logs...`);

  const payload = [];

  for (const log of logs) {
    const key = normalize(log.name);
    const memberId = memberIdMap.get(key);

    if (!memberId) {
      console.warn(`Skipping adjustment log: member not found (${log.name})`);
      continue;
    }

    payload.push({
      alliance_id,

      member_id: memberId,

      issued_at: log.issuedAt,
      adjustment_type: log.adjustmentType,

      count: log.count,
      points: log.points,

      reason: log.reason ?? "",
    });
  }

  const { error } = await supabase.from("adjustment_logs").insert(payload);

  if (error) {
    throw error;
  }

  console.log(`✓ ${payload.length} adjustment logs migrated`);
}
