import "dotenv/config";
import { createMemberIdMap } from "../utils/migrate";

import { ExportData } from "../types/migrate";

import { migrateMembers } from "./migrate/member";
import { migrateWeeks } from "./migrate/weeks";
import { migrateDuelScores } from "./migrate/duelscores";
import { migrateStateRulers } from "./migrate/stateruler";
import { migrateAdjustmentLogs } from "./migrate/adjustmentlog";
import { migratePointRules } from "./migrate/pointrule";

const migrationApiUrl = process.env.NEXT_PUBLIC_MIGRATION_API_URL;
const allianceId = process.env.MIGRATION_ALLIANCE_ID;

async function fetchExportData(): Promise<ExportData> {
  if (!migrationApiUrl) {
    throw new Error("NEXT_PUBLIC_MIGRATION_API_URL missing");
  }
  const response = await fetch(migrationApiUrl, {
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

async function main() {
  console.log("=================================");
  console.log("Starting migration");
  console.log("=================================");

  if (!allianceId) {
    throw new Error("No migration id found");
  }

  const data = await fetchExportData();

  await migrateMembers(data.members, allianceId);

  const memberIdMap = await createMemberIdMap();

  const weekMap = await migrateWeeks(data.weeks, allianceId);

  await migrateDuelScores(data.weeks, weekMap, memberIdMap);

  await migrateStateRulers(data.stateRulers, allianceId);

  await migratePointRules(data.pointRules, allianceId);

  await migrateAdjustmentLogs(data.adjustmentLogs, allianceId, memberIdMap);

  console.log("=================================");
  console.log("Migration completed successfully");
  console.log("=================================");
}

main().catch((error) => {
  console.error("=================================");
  console.error("Migration failed");
  console.error("=================================");
  console.error(error);
  process.exit(1);
});
