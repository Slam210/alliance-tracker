import type { DayKey } from "../../../types/week";

export const START_DAILY = 400_000;
export const END_DAILY = 3_000_000;

export const START_WEEKLY = 3_000_000;
export const END_WEEKLY = 18_000_000;
export const TOTAL_WEEKS = Math.ceil(100 / 7);

export const END_BY_DAY: Record<DayKey, number> = {
  Mon: 3_750_000,
  Tue: 2_250_000,
  Wed: 2_250_000,
  Thu: 4_500_000,
  Fri: 2_250_000,
  Sat: 3_000_000,
  Weekly: 21_000_000,
};
