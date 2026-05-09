import { useMemo, useState } from "react";
import type { DayKey, Week } from "../../../types/week";
import WeekRequirementsPanel from "../components/weekRequirementsPanel";
import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { getSuccessRepeatColor, getFailureRepeatColor } from "../utils/colors";
import { getWeekStartDate } from "../utils/week";
import type { RankedEntry } from "../../../types/derived/rankings";

type WeeklyTabProps = {
  weeks: Week[];

  getDayLabel: (day: DayKey) => string;
};

export default function WeeklyTab({ weeks, getDayLabel }: WeeklyTabProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const selectedWeek = weeks[selectedWeekIndex];
  /* WEEKLY TOP 10 */
  const rankingsByDay = useMemo(() => {
    if (!selectedWeek) return {} as Record<DayKey, RankedEntry[]>;

    const result = {} as Record<DayKey, RankedEntry[]>;

    for (const day of DAYS) {
      result[day] = selectedWeek.members
        .map((member) => {
          const score = member.values[day];
          return score != null ? { ...member, score } : null;
        })
        .filter((m): m is RankedEntry => m !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    return result;
  }, [selectedWeek]);

  const allRankingsByDay = useMemo(() => {
    if (!selectedWeek) return {} as Record<DayKey, RankedEntry[]>;

    const result = {} as Record<DayKey, RankedEntry[]>;

    for (const day of DAYS) {
      result[day] = selectedWeek.members
        .map((member) => {
          const score = member.values[day];
          return score != null ? { ...member, score } : null;
        })
        .filter((m): m is RankedEntry => m !== null)
        .sort((a, b) => b.score - a.score);
    }

    return result;
  }, [selectedWeek]);

  const weeklyMemberInsights = useMemo(() => {
    if (!selectedWeek) {
      return {
        uniqueTop10Members: [],
        repeatingFailures: [],
      };
    }

    const top10Counts = new Map<
      string,
      {
        member: RankedEntry;
        count: number;
      }
    >();

    const failureCounts = new Map<
      string,
      {
        member: RankedEntry;
        count: number;
      }
    >();

    for (const day of DAYS) {
      /* TOP 10 COUNTS */
      rankingsByDay[day]?.forEach((member) => {
        const existing = top10Counts.get(member.id);

        if (existing) {
          existing.count += 1;
        } else {
          top10Counts.set(member.id, {
            member,
            count: 1,
          });
        }
      });

      /* FAILURE COUNTS */
      const requirement = getRequirement(day, selectedWeek.week);

      allRankingsByDay[day]
        ?.filter((m) => m.score < requirement)
        .forEach((member) => {
          const existing = failureCounts.get(member.id);

          if (existing) {
            existing.count += 1;
          } else {
            failureCounts.set(member.id, {
              member,
              count: 1,
            });
          }
        });
    }

    const uniqueTop10Members = Array.from(top10Counts.values()).sort(
      (a, b) => b.count - a.count,
    );

    const repeatingFailures = Array.from(failureCounts.values())
      .filter((m) => m.count >= 1)
      .sort((a, b) => b.count - a.count);

    return {
      uniqueTop10Members,
      repeatingFailures,
    };
  }, [selectedWeek, rankingsByDay, allRankingsByDay]);
  return (
    <div className="space-y-6">
      {/* Week Selector (scrollable on mobile) */}
      {/* Week Selector */}
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
        {weeks.map((week, i) => {
          const active = i === selectedWeekIndex;

          return (
            <button
              key={week.week}
              onClick={() => setSelectedWeekIndex(i)}
              className={`
          min-w-42 snap-start rounded-2xl border transition-all
          px-4 py-3 text-left shadow-md
          ${
            active
              ? "bg-linear-to-br from-blue-800 to-blue-900 border-blue-500 text-white shadow-blue-900/40"
              : "bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-850 hover:border-gray-700"
          }
        `}
            >
              {/* Week */}
              <div className="flex items-center justify-between">
                <div className="text-base font-bold tracking-wide">
                  {week.week}
                </div>

                {active && (
                  <div className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                )}
              </div>

              {/* Divider */}
              <div
                className={`my-3 h-px ${
                  active ? "bg-blue-500/40" : "bg-gray-800"
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-4 w-full lg:w-80">
        <div className="sticky top-4">
          <WeekRequirementsPanel
            week={selectedWeek?.week}
            getWeekStartDate={getWeekStartDate}
            getRequirement={getRequirement}
          />
        </div>
      </div>
      {/* Weekly Member Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Unique Top 10 Members */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-lg overflow-hidden">
          <div className="h-1 bg-linear-to-r from-cyan-500/60 to-blue-500/40" />

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Top 10 Presence</h2>

              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {weeklyMemberInsights.uniqueTop10Members.length} Members
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">
              Members appearing across Top 10 rankings
            </p>
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            {weeklyMemberInsights.uniqueTop10Members.length ? (
              weeklyMemberInsights.uniqueTop10Members.map(
                ({ member, count }) => (
                  <div
                    key={member.id}
                    className={`
                          px-3 py-2 rounded-xl border
                          transition-all
                          ${getSuccessRepeatColor(count)}
                        `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>

                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                        {count}x
                      </span>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="text-sm text-gray-500">No members found</div>
            )}
          </div>
        </div>

        {/* Repeating Failures */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-lg overflow-hidden">
          <div className="h-1 bg-linear-to-r from-red-500/60 to-orange-500/40" />

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Repeat Failures</h2>

              <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                {weeklyMemberInsights.repeatingFailures.length} Members
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">
              Members failing multiple requirements and failing the weekly
              requirement. As a result, people displayed here have a potential
              to be kicked.
            </p>
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            {weeklyMemberInsights.repeatingFailures.map(({ member, count }) => (
              <div
                key={member.id}
                className={`
                          px-3 py-2 rounded-xl border
                          transition-all
                          ${getFailureRepeatColor(count)}
                        `}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name}</span>

                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                    {count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* TOP 10 */}
      <h2 className="text-lg font-bold text-gray-200">Top 10</h2>

      <div className="flex gap-4 overflow-x-auto snap-x pb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="min-w-65 snap-start relative rounded-2xl border border-gray-800 bg-gray-950 shadow-lg"
          >
            <div className="h-1 bg-linear-to-r from-green-500/60 to-lime-500/40 rounded-t-2xl" />

            <div className="p-3 text-center">
              <div className="text-sm font-semibold text-gray-200">
                {getDayLabel(day)}
              </div>
            </div>
            <div className="border-t border-gray-800" />

            <div className="p-3 space-y-1 text-sm">
              {rankingsByDay[day]?.length ? (
                rankingsByDay[day].map((m, i) => (
                  <div
                    key={m.id}
                    className="flex justify-between text-gray-300"
                  >
                    <span className="flex gap-2">
                      <span className="w-5 text-gray-500 text-xs text-right">
                        {i + 1}
                      </span>
                      {m.name}
                    </span>
                    <span className="text-gray-200 tabular-nums">
                      {m.score.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-gray-500 py-6">
                  No data
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Below Requirement */}
      <h2 className="text-lg font-bold text-gray-200">Below Requirement</h2>

      <div className="flex gap-4 overflow-x-auto snap-x pb-2">
        {DAYS.map((day) => {
          const requirement = getRequirement(day, selectedWeek?.week ?? "W1");
          const failingMembers =
            allRankingsByDay[day]
              ?.filter((m) => m.score < requirement)
              .sort((a, b) => a.score - b.score) ?? [];

          return (
            <div
              key={day}
              className="min-w-65 snap-start relative rounded-2xl border border-gray-800 bg-gray-950 shadow-lg"
            >
              <div className="h-1 bg-linear-to-r from-red-500/60 to-orange-500/40 rounded-t-2xl" />

              <div className="p-3 text-center">
                <div className="text-sm font-semibold text-gray-200">
                  {getDayLabel(day)}
                </div>
              </div>

              <div className="border-t border-gray-800" />

              <div className="p-3 space-y-1 text-sm">
                {failingMembers.length ? (
                  failingMembers.map((m, i) => (
                    <div
                      key={m.id}
                      className="flex justify-between text-gray-300"
                    >
                      <span className="flex gap-2">
                        <span className="w-5 text-gray-500 text-xs text-right">
                          {i + 1}
                        </span>

                        {m.name}
                      </span>

                      <span className="text-red-400 tabular-nums">
                        {m.score.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : allRankingsByDay?.[day]?.length ? (
                  <div className="text-center text-xs text-green-400 py-6">
                    Everyone passed
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-500 py-6">
                    No data
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
