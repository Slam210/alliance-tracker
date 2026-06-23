import type { DayKey } from "./week";

/* MEMBER STATUS */
export type MemberStatus = "Active" | "Inactive";

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
}

/* WEEK VALUES FOR A MEMBER */
export type MemberWeekValues = Record<DayKey, number | null>;
