import type {
  MemberWithPoints,
  PointRule,
  WeeklyDailyRankings,
} from "../../../types/derived/eos";
import type { AdjustmentLog } from "../../../types/log";
import type { StateRulerResponse } from "../../../types/stateRuler";
import type { DayKey } from "../../../types/week";
import {
  addAdjustmentLog,
  addAllianceDuelLog,
  addGroupLeaderLog,
  addStateRulerLog,
} from "./log";

function didMemberJoinDuringWeek(memberJoined: string | Date, week: string) {
  const joinDate = new Date(memberJoined);
  joinDate.setHours(0, 0, 0, 0);

  const weekNum = Number(week.replace("W", ""));

  const weekStart = new Date(ALLIANCE_DUEL_START_DATE);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return joinDate >= weekStart && joinDate <= weekEnd;
}

function getCurrentUnlockedDayIndex() {
  const now = new Date();

  const shifted = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const day = shifted.getUTCDay();

  switch (day) {
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 2;
    case 4:
      return 3;
    case 5:
      return 4;
    case 6:
      return 5;
    case 0:
      return 6;
    default:
      return -1;
  }
}

function isUnlockedForLatestWeek(
  weekName: string,
  latestWeekName: string,
  day: string,
) {
  if (weekName !== latestWeekName) return true;

  const dayIndex = DAY_INDEX[day];
  return dayIndex <= getCurrentUnlockedDayIndex();
}

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
  week: string;
  day: string;
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
  exception: boolean,
) {
  if (exception && !metRequirement) {
    return Number(0);
  }

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
  exception: boolean,
) {
  return getRankRulePoints(rules, "daily", rank, metRequirement, exception);
}

export function getWeeklyPoints(
  rank: number,
  metRequirement: boolean,
  rules: PointRule[],
  exception: boolean,
) {
  return getRankRulePoints(rules, "weekly", rank, metRequirement, exception);
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
  const latestWeekNumber = Math.max(
    ...Object.keys(rankings).map((week) => Number(week.replace("W", ""))),
  );

  const latestWeekName = `W${latestWeekNumber}`;

  Object.entries(rankings).forEach(([weekName, week]) => {
    Object.entries(week).forEach(([day, dayData]) => {
      if (!isUnlockedForLatestWeek(weekName, latestWeekName, day)) {
        return;
      }

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
          if (isWeekly && !didMemberJoinDuringWeek) {
            addAllianceDuelLog(member, 8, weekName, day as DayKey);
          } else {
            addAllianceDuelLog(member, 1, weekName, day as DayKey);
          }
        } else {
          const metRequirement = entry.score >= dayData.requirement;
          const exception = entry.exception;

          const points = isWeekly
            ? getWeeklyPoints(entry.rank, metRequirement, pointRules, exception)
            : getDailyPoints(entry.rank, metRequirement, pointRules, exception);

          addAllianceDuelLog(
            member,
            points,
            weekName,
            day as DayKey,
            exception,
          );
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
        if (isWeekly && !didMemberJoinDuringWeek) {
          addAllianceDuelLog(member, 8, weekName, day as DayKey);
        } else {
          addAllianceDuelLog(member, 1, weekName, day as DayKey);
        }
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
  logs: AdjustmentLog[],
) {
  // Group Leader
  Object.values(members).forEach((member) => {
    if (member.groupLeader) {
      const points = getGroupLeaderPoints(pointRules);
      addGroupLeaderLog(member, points);
    }
  });

  // Manual bonuses / penalties
  logs.forEach((log) => {
    const member = members[log.memberID];
    if (!member) return;
    addAdjustmentLog(member, log);
  });
}
