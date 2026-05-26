export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Weekly";

export type MemberWeekValues = Record<DayKey, number | null>;

export interface AllianceDuelEntry {
  id: string;
  name: string;
  counters: {
    daily_top: number;
    daily_bottom: number;
    weekly_top: number;
    weekly_bottom: number;
  };
  values: MemberWeekValues;
  exception: boolean;
}
export interface Week {
  week: string;
  members: AllianceDuelEntry[];
}

export type EntryType =
  | "daily_top"
  | "daily_bottom"
  | "weekly_top"
  | "weekly_bottom"
  | "general";
