import type { DayKey } from "./week";

/* MEMBER STATUS */
export type MemberStatus = "Active" | "Inactive";

export type MemberUpdate = Partial<{
  status: string;
  name: string;
  nickname: string;
  timezone: string;
  display_name: string;
  group_number: number | null;
  group_leader: boolean;
  eos_reward: string;
  reason: string;
}>;

/* CORE MEMBER ENTITY */
export interface Member {
  id: string;
  name: string;
  nickname?: string;
  status: MemberStatus;
  joined_date: string;
  reason?: string;
  timezone?: string;
  display_name?: string;
  group_number: number | null;
  group_leader: boolean;
  eos_reward: string;
  member_inactive_periods: InactivePeriod[];
}

/* WEEK VALUES FOR A MEMBER */
export type MemberWeekValues = Record<DayKey, number | null>;

export type InactivePeriod = {
  id: string;
  start_date: string | null;
  end_date: string | null;
};
