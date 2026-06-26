export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Weekly";

export type EventKey =
  | "Mod Vehicle Boost"
  | "Shelter Upgrade"
  | "Age of Science"
  | "Hero Progression"
  | "Holistic Growth"
  | "Enemy Buster"
  | "Weekly";

export type MemberWeekValues = Record<DayKey, number | null>;

export interface AllianceDuelSubmission {
  id: string;
  name: string;
  entryType: EntryType;
  date: Date;
  points: number;
  exception: boolean;
}

export interface AllianceDuelEntry {
  id: string;
  week_member_id: string;
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
