export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Weekly";

export type MemberWeekValues = Record<DayKey, number | null>;

export interface AllianceDuelEntry {
  id: string;
  name: string;
  type: string;
  values: MemberWeekValues;
}
export interface Week {
  week: string;
  members: AllianceDuelEntry[];
}
