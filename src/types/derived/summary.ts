import type { DayKey } from "../week";

export type Row = {
  week: string;
  values: Record<DayKey, number | null>;
  exception: boolean;
};

export type MemberDaySummary = {
  best: number;
  avg: number;
  total: number;
  worst: number;
  entries: number;
  uniqueEntries: number;
  showSpread: boolean;
};

export type SummaryMode = "positive" | "negative";
