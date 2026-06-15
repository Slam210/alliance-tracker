import type { DayKey } from "./week";

/* MEMBER STATUS */
export type MemberStatus = "Active" | "Inactive";

/* CORE MEMBER ENTITY */
export interface Member {
  id: string;
  name: string;
  nickname?: string;
  status: MemberStatus;
  joinDate: string;
  reason?: string;
  timezone?: string;
  displayName?: string;
  groupNumber: string | "";
  groupLeader: boolean;
  bonusPoints: number;
  penaltyPoints: number;
  eosReward: string;
}

/* WEEK VALUES FOR A MEMBER */
export type MemberWeekValues = Record<DayKey, number | null>;
