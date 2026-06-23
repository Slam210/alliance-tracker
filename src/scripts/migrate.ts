import "dotenv/config";
import { supabase } from "../lib/supabase";
import { Member } from "../types/member";
import { Week } from "../types/week";
import { PointRule } from "../types/derived/eos";
import { AdjustmentLog } from "../types/log";
import { StateRulerRow } from "../types/stateRuler";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Weekly"] as const;

interface ExportData {
  members: Member[];
  weeks: Week[];
  stateRulers: Record<string, StateRulerRow[]>;
  pointRules: PointRule[];
  adjustmentLogs: AdjustmentLog[];
}

async function fetchExportData(): Promise<ExportData> {
  const response = await fetch(process.env.NEXT_PUBLIC_MIGRATION_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "exportAllData",
    }),
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status}`);
  }

  return response.json();
}

async function migrateMembers(members: Member[]) {
  console.log(`Migrating ${members.length} members...`);

  const payload = members.map((member) => ({
    id: member.id,
    name: member.name,
    nickname: member.nickname || null,
    status: member.status || "Active",

    joined_date: member.joined_date || null,
    reason: member.reason || null,

    timezone: member.timezone || null,
    display_name: member.display_name || null,

    group_number:
      member.group_number === null
        ? null
        : // : member.group_number === ""
          //   ? null
          member.group_number,

    group_leader: Boolean(member.group_leader) === true ? true : false,

    eos_reward: member.eos_reward || null,
  }));

  const { error } = await supabase.from("members").upsert(payload);

  if (error) {
    throw error;
  }

  console.log("✓ Members migrated");
}

async function migrateWeeks(weeks: Week[]) {
  console.log(`Migrating ${weeks.length} weeks...`);

  const payload = weeks.map((week) => ({
    week_number: Number(week.week.replace("W", "")),
  }));

  const { error } = await supabase.from("weeks").upsert(payload, {
    onConflict: "week_number",
  });

  if (error) {
    throw error;
  }

  const { data, error: weekError } = await supabase
    .from("weeks")
    .select("id, week_number");

  if (weekError) {
    throw weekError;
  }

  console.log("✓ Weeks migrated");

  return new Map(data.map((week) => [week.week_number, week.id]));
}

async function migrateDuelScores(weeks: Week[], weekMap: Map<number, string>) {
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
      stats.push({
        member_id: member.id,
        week_id: weekId,
        daily_top: member.counters?.daily_top ?? 0,
        daily_bottom: member.counters?.daily_bottom ?? 0,
        weekly_top: member.counters?.weekly_top ?? 0,
        weekly_bottom: member.counters?.weekly_bottom ?? 0,
      });

      for (const day of DAYS) {
        const points = member.values?.[day];

        if (points === null || points === undefined) {
          continue;
        }

        scores.push({
          member_id: member.id,
          week_id: weekId,
          day,
          points,
        });
      }

      if (member.exception) {
        exceptions.push({
          member_id: member.id,
          week_id: weekId,
        });
      }
    }
  }

  console.log(`Inserting ${stats.length} member week stats...`);

  if (stats.length) {
    const { error } = await supabase.from("member_week_stats").upsert(stats, {
      onConflict: "member_id,week_id",
    });

    if (error) {
      throw error;
    }
  }

  console.log(`Inserting ${scores.length} duel scores...`);

  if (scores.length) {
    const { error } = await supabase.from("duel_scores").upsert(scores, {
      onConflict: "member_id,week_id,day",
    });

    if (error) {
      throw error;
    }
  }

  console.log(`Inserting ${exceptions.length} exceptions...`);

  if (exceptions.length) {
    const { error } = await supabase
      .from("duel_exceptions")
      .upsert(exceptions, {
        onConflict: "member_id,week_id",
      });

    if (error) {
      throw error;
    }
  }

  console.log("✓ Duel scores migrated");
}
async function migrateStateRulers(
  stateRulers: Record<string, StateRulerRow[]>,
) {
  console.log("Migrating State Ruler data...");

  // Create SR weeks
  const srWeeks = Object.keys(stateRulers).map((sheetName) => ({
    sr_id: Number(sheetName.replace("SR", "")),
  }));

  const { data: createdWeeks, error: weekError } = await supabase
    .from("state_rulers")
    .upsert(srWeeks, {
      onConflict: "sr_id",
    })
    .select("id, sr_id");

  if (weekError) {
    throw weekError;
  }

  const stateRulerMap = new Map<number, string>();

  for (const week of createdWeeks ?? []) {
    stateRulerMap.set(week.sr_id, week.id);
  }

  // Create entries
  const entries = [];

  for (const [sheetName, rows] of Object.entries(stateRulers)) {
    const weekNumber = Number(sheetName.replace("SR", ""));

    const srId = weekNumber;

    if (!srId) {
      console.warn(`Skipping ${sheetName}: state ruler week not found`);
      continue;
    }

    for (const row of rows) {
      entries.push({
        member_id: row.id,
        sr_id: srId,

        progress_rank: row.progressRank ?? null,
        progress_score: row.progressScore ?? null,

        clash_rank: row.clashRank ?? null,
        clash_score: row.clashScore ?? null,

        last_updated: row.lastUpdated || null,
      });
    }
  }

  if (entries.length) {
    const { error } = await supabase
      .from("state_ruler_entries")
      .upsert(entries, {
        onConflict: "member_id,sr_id",
      });

    if (error) {
      throw error;
    }
  }

  console.log(`✓ ${entries.length} state ruler entries migrated`);
}

async function migratePointRules(pointRules: PointRule[]) {
  console.log(`Migrating ${pointRules.length} point rules...`);

  const payload = pointRules.map((rule) => ({
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

async function migrateAdjustmentLogs(logs: AdjustmentLog[]) {
  console.log(`Migrating ${logs.length} adjustment logs...`);

  const payload = logs.map((log) => ({
    member_id: log.memberID,
    name: log.name,
    nickname: log.nickname,
    issued_at: log.issuedAt,
    adjustment_type: log.adjustmentType,
    count: log.count,
    points: log.points,
    reason: log.reason ?? null,
  }));

  const { error } = await supabase.from("adjustment_logs").upsert(payload);

  if (error) {
    throw error;
  }

  console.log("✓ Adjustment logs migrated");
}

async function main() {
  console.log("=================================");
  console.log("Starting migration");
  console.log("=================================");

  const data = await fetchExportData();

  await migrateMembers(data.members);

  const weekMap = await migrateWeeks(data.weeks);

  await migrateDuelScores(data.weeks, weekMap);

  await migrateStateRulers(data.stateRulers);

  await migratePointRules(data.pointRules);

  await migrateAdjustmentLogs(data.adjustmentLogs);

  console.log("=================================");
  console.log("Migration completed successfully");
  console.log("=================================");
}

main().catch((error) => {
  console.error("Migration failed:");
  console.error(error);
  process.exit(1);
});
