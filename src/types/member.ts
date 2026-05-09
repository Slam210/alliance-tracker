import type { DayKey } from "./day";

/* MEMBER STATUS */
export type MemberStatus = "Active" | "Inactive";

/* CORE MEMBER ENTITY */
export interface Member {
  id: string;
  name: string;
  nickname?: string;
  status: MemberStatus;
  joinDate: string;
}

/* WEEK VALUES FOR A MEMBER */
export type MemberWeekValues = Record<DayKey, number | null>;
