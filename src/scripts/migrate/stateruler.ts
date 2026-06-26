import { supabase } from "../../lib/supabase";
import { StateRulerMigrateRow } from "../../types/migrate";

export async function migrateStateRulers(
  stateRulers: Record<string, StateRulerMigrateRow[]>,
  alliance_id: string,
) {
  console.log("Migrating State Ruler data...");
  const { data: members, error } = await supabase
    .from("members")
    .select("id, name");

  if (error) throw error;

  const memberIdMap = new Map<string, string>();

  const normalize = (value: unknown) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  for (const member of members) {
    memberIdMap.set(normalize(member.name), member.id);
  }

  // 1. Create SR weeks
  const srWeeks = Object.keys(stateRulers).map((sheetName) => ({
    alliance_id,
    sr_week: Number(sheetName.replace("SR", "")),
  }));

  const { data: createdWeeks, error: weekError } = await supabase
    .from("state_rulers")
    .upsert(srWeeks, {
      onConflict: "alliance_id,sr_week",
    })
    .select("id, sr_week");

  if (weekError) throw weekError;

  const stateRulerMap = new Map<number, string>();

  for (const week of createdWeeks ?? []) {
    stateRulerMap.set(week.sr_week, week.id);
  }

  // 2. Create entries
  const entries = [];

  for (const [sheetName, rows] of Object.entries(stateRulers)) {
    const weekNumber = Number(sheetName.replace("SR", ""));

    const stateRulerId = stateRulerMap.get(weekNumber);

    if (!stateRulerId) {
      console.warn(`Skipping ${sheetName}: state ruler week not found`);
      continue;
    }

    for (const row of rows) {
      const key = normalize(row.name);
      const memberId = memberIdMap.get(key);
      entries.push({
        state_ruler_id: stateRulerId,

        member_id: memberId,

        progress_rank: row.progressRank ?? null,
        progress_score: row.progressScore ?? null,

        clash_rank: row.clashRank ?? null,
        clash_score: row.clashScore ?? null,
      });
    }
  }

  // 3. Insert entries
  if (entries.length) {
    const { error } = await supabase
      .from("state_ruler_entries")
      .upsert(entries, {
        onConflict: "state_ruler_id,member_id",
      });

    if (error) throw error;
  }

  console.log(`✓ ${entries.length} state ruler entries migrated`);
}
