import type { EventKey } from "./week";

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
  | StateRulerParticipationLog
  | StateRulerLog
  | GroupLeaderLog
  | AdjustmentLog
  | InfractionLog;

export type AllianceDuelLog = {
  type: "alliance_duel";
  points: number;
  week: string;
  event: EventKey;
  exception: boolean;
};

export type StateRulerParticipationLog = {
  type: "state_ruler_participation";
  week: string;
  points: number;
};

export type StateRulerLog = {
  type: "state_ruler";
  week: string;
  category: "clash" | "progress";
  points: number;
  rank: number;
  score: number;
};

export type InfractionLog = {
  type: "infraction";
  week: string;
  infraction: string;
  points: number;
  reason: string | null;
};

export type GroupLeaderLog = {
  type: "group_leader";
  points: number;
};
