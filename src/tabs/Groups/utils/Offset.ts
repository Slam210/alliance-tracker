import timezones from "../../../data/timezones.json";
import type { TimezoneBucket } from "../../../types/derived/groups";

export function getEffectiveOffset(timezoneKey?: string) {
  if (!timezoneKey) return 0;

  let tz: TimezoneBucket | undefined;

  for (const key in timezones as Record<string, TimezoneBucket>) {
    const entry = (timezones as Record<string, TimezoneBucket>)[key];

    if (entry.displayName === timezoneKey) {
      tz = entry;
      break;
    }
  }

  if (!tz) return 0;

  return tz.baseOffsetMinutes + (tz.dstOffsetMinutes || 0);
}

export function formatOffsetHours(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);

  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;

  const formatted =
    minutes === 0 ? `${hours}` : `${hours}:${minutes}`.padStart(4, "0");

  return `UTC${sign}${formatted}`;
}
