import type { DayKey } from "./week";

export type adjustmentType = "bonus" | "penalty";

export interface AddAdjustmentLogParams {
  memberID: string;
  adjustmentType: adjustmentType;
  count: number;
  points: number;
  reason: string;
}

export type AdjustmentLog = {
  type: "adjustment";
  logID: string;
  memberID: string;
  name: string;
  nickname: string;
  issuedAt: string;
  adjustmentType: adjustmentType;
  count: number;
  points: number;
  reason: string;
};

export type PointLog =
  | AllianceDuelLog
  | StateRulerLog
  | GroupLeaderLog
  | AdjustmentLog;

export type AllianceDuelLog = {
  type: "alliance_duel";
  points: number;
  week: string;
  day: DayKey;
  exception: boolean;
};

export type StateRulerLog = {
  type: "state_ruler";
  week: string;
  category: "clash" | "progress";
  points: number;
  rank: number;
  score: number;
};

export type GroupLeaderLog = {
  type: "group_leader";
  points: number;
};
