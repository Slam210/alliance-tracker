import type { MemberWithPoints } from "../../../types/derived/eos";
import type { DayKey } from "../../../types/week";

export function addAllianceDuelLog(
  member: MemberWithPoints,
  points: number,
  week: string,
  day: DayKey,
) {
  member.points += points;

  member.logs.push({
    type: "alliance_duel",
    points,
    week,
    day,
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

export function addEOSlog(
  member: MemberWithPoints,
  type: "eos_bonus" | "eos_penalty",
  points: number,
) {
  if (type === "eos_bonus") {
    member.points += Number(points);
  } else {
    member.points -= Math.abs(Number(points));
  }
  member.logs.push({
    type,
    points,
  });
}
