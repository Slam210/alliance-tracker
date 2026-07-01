import { getAllianceEventIndex, getEventFromDate } from "../../../../constants/week";
import type {
  MemberWithPoints,
  WeeklyDailyRankings,
  PointRule,
} from "../../../../types/derived/eos";
import type { EventKey } from "../../../../types/week";
import { parseDateOnly } from "../../../../utils/date";
import { getWeekNumber } from "../../../../utils/week";
import { EVENT_MAP } from "../../../AlliianceDuel/constants/event";
import { addAllianceDuelLog } from "../log";
import { didMemberJoinBeforeEvent } from "./duelDates";
import { getWeeklyPoints, getDailyPoints } from "./pointRules";

type WeekPoints = Record<
  string,
  Record<string, Record<string, number | null>>
>;

type DateKey = string;

/**
 * Helpers
 */
function toDateKey(date: Date): DateKey {
  return date.toISOString().slice(0, 10);
}

/**
 * Expands inactive periods into a fast lookup set per member
 */
 function buildInactiveMap(
   members: Record<string, MemberWithPoints>,
   ALLIANCE_DUEL_START_DATE: Date,
 ) {
   const map: Record<string, Set<string>> = {};

   for (const member of Object.values(members)) {
     const set = new Set<string>();

     for (const period of member.member_inactive_periods ?? []) {
       if (!period.start_date || !period.end_date) continue;

       const start = parseDateOnly(period.start_date);
       const end = parseDateOnly(period.end_date);

       const cursor = new Date(start);

       // If the first inactive day is Weekly, don't count that day.
       if (getEventFromDate(cursor, ALLIANCE_DUEL_START_DATE) === "Weekly") {
         cursor.setDate(cursor.getDate() + 1);
       }

       while (cursor <= end) {
         set.add(toDateKey(cursor));
         cursor.setDate(cursor.getDate() + 1);
       }
     }

     map[member.id] = set;
   }

   return map;
 }

/**
 * Builds a mapping:
 * "W3 Hero Progression" -> [2026-06-24, ...]
 */
function buildCalendarMap(startDate: Date, endDate: Date) {
  const map: Record<string, Date[]> = {};

  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const date = new Date(cursor);

    const weekName = getWeekNumber(date, startDate);
    const eventName = getEventFromDate(date, startDate);

    const key = `${weekName} ${eventName}`;

    if (!map[key]) map[key] = [];
    map[key].push(date);

    cursor.setDate(cursor.getDate() + 1);
  }

  return map;
}

export function applyAllianceDuelPoints(
  members: Record<string, MemberWithPoints>,
  rankings: WeeklyDailyRankings,
  pointRules: PointRule[],
  ALLIANCE_DUEL_START_DATE: Date,
) {
  /**
   * PHASE 0: Build inactivity + calendar maps
   */
  const inactiveMap = buildInactiveMap(members, ALLIANCE_DUEL_START_DATE);

  const calendarMap = buildCalendarMap(
    ALLIANCE_DUEL_START_DATE,
    new Date(),
  );

  /**
   * PHASE 1: Build full points matrix first
   */
  const weekPoints: WeekPoints = {};

  const index = getAllianceEventIndex(
    new Date(),
    ALLIANCE_DUEL_START_DATE,
  );

  const latestWeek = Object.keys(rankings).at(-1);
  const latestWeekData = latestWeek ? rankings[latestWeek] : undefined;

  const latestWeekComplete =
    latestWeekData &&
    Object.values(EVENT_MAP).every((event) => {
      const eventData = latestWeekData[event as EventKey];
      return eventData && eventData.rankings.length > 0;
    });

  const unlockedEvents = new Set<string>();

  if (index === 6) {
    Object.values(EVENT_MAP).forEach((event) => unlockedEvents.add(event));
  } else {
    for (let i = 0; i <= index; i++) {
      unlockedEvents.add(EVENT_MAP[i]);
    }

    if (index >= 5) {
      unlockedEvents.add("Weekly");
    }
  }

  for (const [weekName, week] of Object.entries(rankings)) {
    weekPoints[weekName] = {};

    for (const [event, eventData] of Object.entries(week)) {
      if (
        weekName === latestWeek &&
        !unlockedEvents.has(event) &&
        !latestWeekComplete
      ) {
        continue;
      }

      const isWeekly = event === "Weekly";

      weekPoints[weekName][event] = {};

      const seenMembers = new Set<string>();

      /**
       * Ranked members
       */
      for (const entry of eventData.rankings) {
        const member = members[entry.id];
        if (!member) continue;

        const eligible = didMemberJoinBeforeEvent({
          memberJoined: member.joined_date,
          week: weekName,
          event,
          ALLIANCE_DUEL_START_DATE,
        });

        if (!eligible || !eventData.requirement) continue;

        seenMembers.add(entry.id);

        const points =
          entry.score === null
            ? isWeekly
              ? getWeeklyPoints(null, false, pointRules, entry.exception)
              : getDailyPoints(null, false, pointRules, entry.exception)
            : isWeekly
              ? getWeeklyPoints(
                  entry.rank,
                  entry.score >= eventData.requirement,
                  pointRules,
                  entry.exception,
                )
              : getDailyPoints(
                  entry.rank,
                  entry.score >= eventData.requirement,
                  pointRules,
                  entry.exception,
                );

        weekPoints[weekName][event][entry.id] = points;
      }

      /**
       * Members not in ranking list
       */
      for (const member of Object.values(members)) {
        const eligible = didMemberJoinBeforeEvent({
          memberJoined: member.joined_date,
          week: weekName,
          event,
          ALLIANCE_DUEL_START_DATE,
        });

        if (!eligible) continue;
        if (seenMembers.has(member.id)) continue;

        const points = isWeekly
          ? getWeeklyPoints(null, false, pointRules, false)
          : getDailyPoints(null, false, pointRules, false);

        weekPoints[weekName][event][member.id] = points;
      }
    }
  }


  /**
   * PHASE 2: Emit logs
   */
  const DAILY_EVENTS: EventKey[] = [
    "Mod Vehicle Boost",
    "Shelter Upgrade",
    "Age of Science",
    "Hero Progression",
    "Holistic Growth",
    "Enemy Buster",
  ];

  // console.log(calendarMap)

  for (const [weekName, events] of Object.entries(weekPoints)) {
    for (const [event, memberPoints] of Object.entries(events)) {
      const weekEventKey = `${weekName.replace(/^W/, "")} ${event}`;
      const eventDates = calendarMap[weekEventKey];

      for (const [memberId, points] of Object.entries(memberPoints)) {
        const member = members[memberId];
        if (!member) continue;
        if (points === null) continue;

        /**
         * Daily event failed logic
         */
        if (event !== "Weekly" && points < 0) {
          const weeklyPoints = events["Weekly"]?.[memberId];

          if (
            weeklyPoints !== undefined &&
            (weeklyPoints === null || weeklyPoints > 0)
          ) {
            continue;
          }
        }

        /**
         * Weekly failed logic
         */
        if (event === "Weekly" && points < 0) {
          const hasDailyFail = DAILY_EVENTS.some(
            (dailyEvent) =>
              (events[dailyEvent]?.[memberId] ?? 0) < 0,
          );

          if (!hasDailyFail) {
            continue;
          }
        }

        /**
         * NEW: Inactivity check (skip scoring entirely if inactive during event date)
         */

        const isInactive = eventDates?.some((date) => {
          return inactiveMap[memberId]?.has(toDateKey(date))
        })

        if (isInactive) continue;

        addAllianceDuelLog(member, points, weekName, event as EventKey);
      }
    }
  }
}
