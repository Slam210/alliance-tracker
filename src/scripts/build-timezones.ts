import fs from "fs";
import path from "path";
import { TimezoneDataGroups } from "../types/derived/groups";

function parseOffset(offset: string | undefined): number {
  if (!offset) return 0;

  // "-10 : 00" → -600
  const cleaned = offset.replace(/\s/g, "");
  const [hours, minutes] = cleaned.split(":").map(Number);

  return hours * 60 + (minutes || 0);
}

function buildGroups(csv: string): TimezoneDataGroups {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const dataLines = lines.slice(1);

  return dataLines.reduce<TimezoneDataGroups>((groups, line) => {
    const [timezoneId, rawOffset, dstOffset, display_name] = line.split(",");

    if (!timezoneId || !display_name) return groups;

    const baseOffsetMinutes = parseOffset(rawOffset);
    const dstOffsetMinutes = dstOffset ? Number(dstOffset) : 0;

    const key = `${baseOffsetMinutes}:${dstOffsetMinutes}:${display_name}`;

    if (!groups[key]) {
      groups[key] = {
        display_name,
        baseOffsetMinutes,
        dstOffsetMinutes,
        zoneIds: [],
      };
    }

    groups[key].zoneIds.push(timezoneId);

    return groups;
  }, {});
}

function main() {
  const csvPath = path.join(process.cwd(), "public", "data", "Timezones.csv");
  const outPath = path.join(process.cwd(), "public", "data", "timezones.json");

  const csv = fs.readFileSync(csvPath, "utf-8");

  const groups = buildGroups(csv);

  fs.writeFileSync(outPath, JSON.stringify(groups, null, 2), "utf-8");

  console.log(`✅ Timezones written to ${outPath}`);
  console.log(`📦 Groups: ${Object.keys(groups).length}`);
}

main();
