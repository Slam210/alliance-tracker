import { getAllianceEventIndex } from "../../../../constants/week";
import type {
  MemberWithPoints,
  WeeklyDailyRankings,
  PointRule,
} from "../../../../types/derived/eos";
import type { EventKey } from "../../../../types/week";
import { EVENT_MAP } from "../../../AlliianceDuel/constants/event";
import { addAllianceDuelLog } from "../log";
import {
  didMemberJoinBeforeEvent,
} from "./duelDates";
import { getWeeklyPoints, getDailyPoints } from "./pointRules";

type WeekPoints = Record<
  string,
  Record<string, Record<string, number | null>>
>;

export function applyAllianceDuelPoints(
  members: Record<string, MemberWithPoints>,
  rankings: WeeklyDailyRankings,
  pointRules: PointRule[],
  ALLIANCE_DUEL_START_DATE: Date,
) {
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
    // Weekly day = everything unlocked
    Object.values(EVENT_MAP).forEach((event) => unlockedEvents.add(event));
  } else {
    // Unlock daily events up through today
    for (let i = 0; i <= index; i++) {
      unlockedEvents.add(EVENT_MAP[i]);
    }

    // Weekly becomes available once Enemy Buster starts
    if (index >= 5) {
      unlockedEvents.add("Weekly");
    }
  }

  for (const [weekName, week] of Object.entries(rankings)) {
    weekPoints[weekName] = {};

    for (const [event, eventData] of Object.entries(week)) {
      // Skip locked events for the latest week only
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

      // Ranked members
      for (const entry of eventData.rankings) {
        const member = members[entry.id];
        if (!member) continue;

        const eligible = didMemberJoinBeforeEvent({
          memberJoined: member.joined_date,
          week: weekName,
          event,
          ALLIANCE_DUEL_START_DATE,
        });

        seenMembers.add(entry.id);

        if (!eligible) continue;

        const points =
          entry.score === null
            ? isWeekly
              ? getWeeklyPoints(
                  null,
                  false,
                  pointRules,
                  entry.exception,
                )
              : getDailyPoints(
                  null,
                  false,
                  pointRules,
                  entry.exception,
                )
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

      // Members not in ranking list
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
          ? getWeeklyPoints(
              null,
              false,
              pointRules,
              false,
            )
          : getDailyPoints(
              null,
              false,
              pointRules,
              false,
            );

        weekPoints[weekName][event][member.id] = points;
      }
    }
  }

  /**
   * PHASE 2: Emit logs from precomputed structure
   */
  const DAILY_EVENTS: EventKey[] = [
    "Mod Vehicle Boost",
    "Shelter Upgrade",
    "Age of Science",
    "Hero Progression",
    "Holistic Growth",
    "Enemy Buster",
  ];

  for (const [weekName, events] of Object.entries(weekPoints)) {
    for (const [event, memberPoints] of Object.entries(events)) {
      for (const [memberId, points] of Object.entries(memberPoints)) {
        const member = members[memberId];
        if (!member) continue;
         if (points === null) continue;

        // Daily event failed
        if (event !== "Weekly" && points < 0) {
          const weeklyPoints = events["Weekly"]?.[memberId];

          // Weekly passed -> ignore the daily fail
          if (weeklyPoints !== undefined && (weeklyPoints === null || weeklyPoints > 0)) {
            continue;
          }
        }

        // Weekly failed
        if (event === "Weekly" && points < 0) {
          const hasDailyFail = DAILY_EVENTS.some(
            (dailyEvent) => (events[dailyEvent]?.[memberId] ?? 0) < 0,
          );

          // No daily failures -> ignore the weekly fail
          if (!hasDailyFail) {
            continue;
          }
        }

        addAllianceDuelLog(
          member,
          points,
          weekName,
          event as EventKey,
        );
      }
    }
  }
}
