import { normalize } from "path";
import { DAYS } from "../../features/Rankings/constants/days";
import { supabase } from "../../lib/supabase";
import { Week } from "../../types/week";

export async function migrateDuelScores(
  weeks: Week[],
  weekMap: Map<number, string>,
  memberIdMap: Map<string, string>,
) {
  console.log("Migrating duel scores...");

  const scores = [];
  const exceptions = [];
  const stats = [];

  for (const week of weeks) {
    const weekNumber = Number(week.week.replace("W", ""));
    const weekId = weekMap.get(weekNumber);

    if (!weekId) {
      throw new Error(`Week ${weekNumber} not found`);
    }

    for (const member of week.members) {
      const key = normalize(member.name);
      const memberId = memberIdMap.get(key);

      if (!memberId) {
        console.warn(`Skipping member not found: ${member.id}, ${week.week}`);
        continue;
      }

      // WEEK STATS
      stats.push({
        member_id: memberId,
        week_id: weekId,
        daily_top: member.counters?.daily_top ?? 0,
        daily_bottom: member.counters?.daily_bottom ?? 0,
        weekly_top: member.counters?.weekly_top ?? 0,
        weekly_bottom: member.counters?.weekly_bottom ?? 0,
      });

      // SCORES
      for (const day of DAYS) {
        const points = member.values?.[day];

        if (points === null || points === undefined) continue;

        scores.push({
          member_id: memberId,
          week_id: weekId,
          day,
          points,
        });
      }

      // EXCEPTIONS
      if (member.exception) {
        exceptions.push({
          member_id: memberId,
          week_id: weekId,
        });
      }
    }
  }

  // INSERT STATS
  console.log(`Inserting ${stats.length} member week stats...`);

  if (stats.length) {
    const { error } = await supabase.from("member_week_stats").upsert(stats, {
      onConflict: "member_id,week_id",
    });

    if (error) throw error;
  }

  // INSERT SCORES
  console.log(`Inserting ${scores.length} duel scores...`);

  if (scores.length) {
    const { error } = await supabase.from("duel_scores").upsert(scores, {
      onConflict: "week_id,member_id,day",
    });

    if (error) throw error;
  }

  console.log(`Inserting ${exceptions.length} exceptions...`);

  if (exceptions.length) {
    const { error } = await supabase
      .from("duel_exceptions")
      .upsert(exceptions, {
        onConflict: "week_id,member_id",
      });

    if (error) throw error;
  }

  console.log("✓ Duel scores migrated");
}
