import type {
  MemberWithPoints,
  PointRule,
  WeeklyDailyRankings,
} from "../../../types/derived/eos";
import type { StateRulerResponse } from "../../../types/stateRuler";
import type { DayKey } from "../../../types/week";
import {
  addAllianceDuelLog,
  addEOSlog,
  addGroupLeaderLog,
  addStateRulerLog,
} from "./log";

const ALLIANCE_DUEL_START_DATE = new Date("2026-04-20");

const DAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Weekly: 6,
};

export function didMemberJoinBeforeEvent(params: {
  memberJoined: string | Date;
  week: string; // "W1"
  day: string; // "Mon" | ...
}) {
  const { memberJoined, week, day } = params;

  const joinDate = new Date(memberJoined);
  joinDate.setHours(0, 0, 0, 0);

  const weekNum = parseInt(week.replace("W", ""), 10);
  const dayIndex = DAY_INDEX[day] ?? 0;

  const eventDate = new Date(ALLIANCE_DUEL_START_DATE);
  eventDate.setHours(0, 0, 0, 0);

  // move forward by weeks
  eventDate.setDate(eventDate.getDate() + (weekNum - 1) * 7);

  // move forward by day
  eventDate.setDate(eventDate.getDate() + dayIndex);

  return joinDate <= eventDate;
}

function getRule(rules: PointRule[], system: string, type: string) {
  return rules.find((rule) => rule.system === system && rule.type === type);
}

function getRankRulePoints(
  rules: PointRule[],
  system: "daily" | "weekly",
  rank: number,
  metRequirement: boolean,
) {
  if (!metRequirement) {
    return Number(
      rules.find((rule) => rule.system === system && rule.type === "below_req")
        ?.points ?? 1,
    );
  }

  const rule = rules.find(
    (rule) =>
      rule.system === system &&
      rule.type === "rank" &&
      rank >= (rule.minRank ?? 0) &&
      (rule.maxRank == null || rank <= rule.maxRank),
  );

  return Number(rule?.points ?? 0);
}

export function getDailyPoints(
  rank: number,
  metRequirement: boolean,
  rules: PointRule[],
) {
  return getRankRulePoints(rules, "daily", rank, metRequirement);
}

export function getWeeklyPoints(
  rank: number,
  metRequirement: boolean,
  rules: PointRule[],
) {
  return getRankRulePoints(rules, "weekly", rank, metRequirement);
}

function getStateRulerRulePoints(
  rules: PointRule[],
  type: "progress" | "clash",
) {
  return getRule(rules, "stateruler", type)?.points ?? 0;
}

function getGroupLeaderPoints(rules: PointRule[]) {
  return getRule(rules, "eos", "group_leader")?.points ?? 0;
}

export function applyAllianceDuelPoints(
  members: Record<string, MemberWithPoints>,
  rankings: WeeklyDailyRankings,
  pointRules: PointRule[],
) {
  console.log(rankings);
  Object.entries(rankings).forEach(([weekName, week]) => {
    Object.entries(week).forEach(([day, dayData]) => {
      const isWeekly = day === "Weekly";

      const seenMembers = new Set<string>();

      dayData.rankings.forEach((entry) => {
        const member = members[entry.id];
        if (!member) return;

        const eligible = didMemberJoinBeforeEvent({
          memberJoined: member.joinDate,
          week: weekName,
          day,
        });

        seenMembers.add(entry.id);
        if (!eligible) {
          return;
        }

        if (entry.score === null) {
          addAllianceDuelLog(member, isWeekly ? 8 : 1, weekName, day as DayKey);
        } else {
          const metRequirement = entry.score >= dayData.requirement;

          const points = isWeekly
            ? getWeeklyPoints(entry.rank, metRequirement, pointRules)
            : getDailyPoints(entry.rank, metRequirement, pointRules);

          addAllianceDuelLog(member, points, weekName, day as DayKey);
        }
      });
      Object.values(members).forEach((member) => {
        const eligible = didMemberJoinBeforeEvent({
          memberJoined: member.joinDate,
          week: weekName,
          day,
        });

        if (!eligible) return;
        if (seenMembers.has(member.id)) return;
        addAllianceDuelLog(member, isWeekly ? 8 : 1, weekName, day as DayKey);
      });
    });
  });
}

export function applyStateRulerPoints(
  members: Record<string, MemberWithPoints>,
  stateRulerData: StateRulerResponse,
  pointRules: PointRule[],
) {
  Object.entries(stateRulerData).forEach(([weekName, rows]) => {
    rows.forEach((row) => {
      const member = members[row.id];
      if (!member) return;

      // PROGRESS
      if (row.progressRank != null && row.progressScore != null) {
        const points = getStateRulerRulePoints(pointRules, "progress");
        addStateRulerLog(
          member,
          weekName,
          "progress",
          points,
          row.progressRank,
          row.progressScore,
        );
      }

      // CLASH
      if (row.clashRank != null && row.clashScore != null) {
        const points = getStateRulerRulePoints(pointRules, "clash");
        addStateRulerLog(
          member,
          weekName,
          "clash",
          points,
          row.clashRank,
          row.clashScore,
        );
      }
    });
  });
}

export function applyEOSBonuses(
  members: Record<string, MemberWithPoints>,
  pointRules: PointRule[],
) {
  // Group Leader
  Object.values(members).forEach((member) => {
    if (member.groupLeader) {
      const points = getGroupLeaderPoints(pointRules);
      addGroupLeaderLog(member, points);
    }
  });

  // Bonus Points
  Object.values(members).forEach((member) => {
    const bonus = Number(member.bonusPoints ?? 0);
    if (bonus <= 0) return;
    addEOSlog(member, "eos_bonus", bonus);
  });

  // Penalty Points
  Object.values(members).forEach((member) => {
    const penalty = Math.abs(Number(member.penaltyPoints ?? 0));
    addEOSlog(member, "eos_penalty", penalty);
  });
}
