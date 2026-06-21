import type {
  MemberWithPoints,
  WeeklyDailyRankings,
  PointRule,
} from "../../../../types/derived/eos";
import type { DayKey } from "../../../../types/week";
import { addAllianceDuelLog } from "../log";
import {
  isUnlockedForLatestWeek,
  didMemberJoinBeforeEvent,
  didMemberJoinDuringWeek,
} from "./duelDates";
import { getWeeklyPoints, getDailyPoints } from "./pointRules";

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
          if (isWeekly && !didMemberJoinDuringWeek(member.joinDate, weekName)) {
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
        if (isWeekly && !didMemberJoinDuringWeek(member.joinDate, weekName)) {
          addAllianceDuelLog(member, 8, weekName, day as DayKey);
        } else {
          addAllianceDuelLog(member, 1, weekName, day as DayKey);
        }
      });
    });
  });
}
