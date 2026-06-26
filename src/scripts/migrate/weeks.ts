import { supabase } from "../../lib/supabase";
import { Week } from "../../types/week";

export async function migrateWeeks(weeks: Week[], alliance_id: string) {
  console.log(`Migrating ${weeks.length} weeks...`);

  const payload = weeks.map((week) => ({
    alliance_id,
    week_number: Number(week.week.replace("W", "")),
  }));

  const { error } = await supabase.from("weeks").upsert(payload, {
    onConflict: "alliance_id,week_number",
  });

  if (error) throw error;

  const { data, error: weekError } = await supabase
    .from("weeks")
    .select("id, week_number, alliance_id");

  if (weekError) throw weekError;

  console.log("✓ Weeks migrated");

  return new Map(data.map((w) => [w.week_number, w.id]));
}
