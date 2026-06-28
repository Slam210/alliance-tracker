export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Weekly";

export type EventKey =
  | "Mod Vehicle Boost"
  | "Shelter Upgrade"
  | "Age of Science"
  | "Hero Progression"
  | "Holistic Growth"
  | "Enemy Buster"
  | "Weekly";

export type MemberWeekValues = Record<EventKey, number | null>;

export interface AllianceDuelSubmission {
  id: string;
  name: string;
  date: Date;
  points: number;
  exception: boolean;
}

export interface AllianceUpdateSubmission {
  date: Date;
  startDate: Date;
}

export interface AllianceDuelApiEntry {
  id: string;
  week_member_id: string;
  name: string;
  values: MemberWeekValues;
  exception: boolean;
}

export interface AllianceDuelEntry extends AllianceDuelApiEntry {
  counters: {
    daily_top: number;
    daily_bottom: number;
    weekly_top: number;
    weekly_bottom: number;
  };
}

export interface ApiWeek {
  week: string;
  members: AllianceDuelApiEntry[];
}

export interface Week {
  week: string;
  members: AllianceDuelEntry[];
}
