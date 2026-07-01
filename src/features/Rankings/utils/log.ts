import type { MemberWithPoints } from "../../../types/derived/eos";
import type { AdjustmentLog } from "../../../types/log";
import type { EventKey } from "../../../types/week";

export function addAllianceDuelLog(
  member: MemberWithPoints,
  points: number,
  week: string,
  event: EventKey,
  exception?: boolean,
) {
  member.points += points;

  member.logs.push({
    type: "alliance_duel",
    points,
    week,
    event,
    exception: exception ?? false,
  });
}

export function addStateRulerParticipationLog(
  member: MemberWithPoints,
  week: string,
  points: number,
) {
  if (points === 0) return;

  member.points += points;

  member.logs.push({
    type: "state_ruler_participation",
    week,
    points,
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
  if (points === 0) return;

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

export function addStateRulerInfractionLog(
  member: MemberWithPoints,
  week: string,
  infraction: string | null,
  points: number,
  reason: string | null,
) {
  if (points === 0 || infraction === null) return;

  member.points += points;

  member.logs.push({
    type: "infraction",
    week: week.replace("SR", "State Ruler "),
    infraction,
    points,
    reason,
  });
}

export function addGroupLeaderLog(member: MemberWithPoints, points: number) {
  if (points === 0) return;

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

export function groupLogs(logs: MemberWithPoints["logs"]) {
  return logs.reduce(
    (acc, log) => {
      const key = log.type;

      if (!acc[key]) {
        acc[key] = {
          logs: [],
          total: 0,
        };
      }

      acc[key].logs.push(log);

      if (log.type === "adjustment" && log.adjustmentType === "penalty") {
        acc[key].total -= log.points;
      } else {
        acc[key].total += log.points;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        logs: typeof logs;
        total: number;
      }
    >,
  );
}
