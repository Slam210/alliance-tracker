import fs from "fs";
import path from "path";
import process from "process";
import type { TimezoneGroups } from "../../types/timezones";

function parseOffset(offset?: string): number {
  if (!offset) return 0;

  const cleaned = offset.replace(/\s/g, "");
  const [hours, minutes] = cleaned.split(":").map(Number);

  return hours * 60 + (minutes || 0);
}

function buildTimezoneGroups(): TimezoneGroups {
  const filePath = path.join(process.cwd(), "public", "data", "Timezones.csv");

  const csv = fs.readFileSync(filePath, "utf-8");

  const lines = csv.split(/\r?\n/).filter(Boolean);
  const dataLines = lines.slice(1);

  return dataLines.reduce<TimezoneGroups>((groups, line) => {
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

/**
 * Static dataset (computed once at import time)
 */
export const timeZoneGroups = buildTimezoneGroups();
