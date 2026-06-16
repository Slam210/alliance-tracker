import type { MemberWithPoints } from "../../../types/derived/eos";
import type { AdjustmentLog } from "../../../types/log";
import type { DayKey } from "../../../types/week";

export function addAllianceDuelLog(
  member: MemberWithPoints,
  points: number,
  week: string,
  day: DayKey,
  exception?: boolean,
) {
  member.points += points;

  member.logs.push({
    type: "alliance_duel",
    points,
    week,
    day,
    exception: exception ?? false,
  });
}

export function addStateRulerLog(
  member: MemberWithPoints,
  week: string,
  category: "clash" | "progress",
  points: number,
  rank: number,
  score: number,
) {
  member.points += points;

  member.logs.push({
    type: "state_ruler",
    week,
    category,
    points,
    rank,
    score,
  });
}

export function addGroupLeaderLog(member: MemberWithPoints, points: number) {
  member.points += points;

  member.logs.push({
    type: "group_leader",
    points,
  });
}

export function addAdjustmentLog(member: MemberWithPoints, log: AdjustmentLog) {
  if (log.adjustmentType === "bonus") {
    member.points += log.count * log.points;
  } else {
    member.points -= log.count * log.points;
  }

  member.logs.push({
    type: "adjustment",
    logID: log.logID,
    memberID: member.id,
    name: log.name,
    nickname: log.nickname,
    issuedAt: log.issuedAt,
    adjustmentType: log.adjustmentType,
    count: log.count,
    points: log.points,
    reason: log.reason,
  });
}
