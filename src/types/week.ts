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
}
export interface Week {
  week: string;
  members: AllianceDuelEntry[];
}
