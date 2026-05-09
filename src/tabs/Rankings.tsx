import { useMemo, useState } from "react";
import type { AllianceDuelEntry, Week } from "../types/week";
import type { Member } from "../types/member";
import WeekRequirementsPanel from "../_components/weekRequirementsPanel";

/* TYPES */

const EVENT_MAP = {
  Mon: "Mod Vehicle Boost",
  Tue: "Shelter Upgrade",
  Wed: "Age of Science",
  Thu: "Hero Progression",
  Fri: "Holistic Growth",
  Sat: "Enemy Buster",
} as const;

type EventDay = keyof typeof EVENT_MAP; // Mon–Sat
type DayKey = EventDay | "Weekly";

type Props = { weeks: Week[]; members: Member[] };

type RankedEntry = AllianceDuelEntry & { score: number };

/* CONSTANTS */

const DAYS: DayKey[] = [...Object.keys(EVENT_MAP), "Weekly"] as DayKey[];

const ALLIANCE_DUEL_START_DATE = new Date("2026-04-20T00:00:00-00:00");

function getWeekStartDate(weekName: string) {
  const match = weekName.match(/^W(\d+)$/);

  if (!match) return new Date();

  const weekNumber = Number(match[1]);

  const start = new Date(ALLIANCE_DUEL_START_DATE);

  start.setDate(start.getDate() + (weekNumber - 1) * 7);

  return start;
}

function getWeekIndex(weekName: string) {
  const match = weekName.match(/^W(\d+)$/);
  if (!match) return 0;
  return Number(match[1]);
}
const TOTAL_WEEKS = Math.ceil(100 / 7); // ~15 weeks

export default function Rankings({ weeks, members }: Props) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"weekly" | "alltime" | "members">(
    "weekly",
  );

  const activeMemberIds = useMemo(() => {
    return new Set(
      members.filter((m) => m.status === "Active").map((m) => m.id),
    );
  }, [members]);

  const selectedWeek = weeks[selectedWeekIndex];

  /* LABEL HELPER */
  const getDayLabel = (day: DayKey) => {
    if (day === "Weekly") return "Weekly Calculation";
    return EVENT_MAP[day as EventDay];
  };

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

  /* WEEKLY BOTTOM 10 */
  // const bottomRankingsByDay = useMemo(() => {
  //   if (!selectedWeek) return {} as Record<DayKey, RankedEntry[]>;

  //   const result = {} as Record<DayKey, RankedEntry[]>;

  //   for (const day of DAYS) {
  //     result[day] = selectedWeek.members
  //       .map((member) => {
  //         const score = member.values[day];
  //         return score != null ? { ...member, score } : null;
  //       })
  //       .filter((m): m is RankedEntry => m !== null)
  //       .sort((a, b) => a.score - b.score)
  //       .slice(0, 10);
  //   }

  //   return result;
  // }, [selectedWeek]);

  /* ALL TIME TOP 10 */
  const allTimeRankings = useMemo(() => {
    return DAYS.map((day) => {
      const map = new Map<string, RankedEntry>();

      for (const week of weeks) {
        for (const member of week.members) {
          if (!activeMemberIds.has(member.id)) continue;

          const score = member.values[day];
          if (score == null) continue;

          const existing = map.get(member.id);

          if (!existing || score > existing.score) {
            map.set(member.id, { ...member, score });
          }
        }
      }

      const top10 = Array.from(map.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return {
        day,
        top10,
      };
    });
  }, [weeks, activeMemberIds]);

  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const filteredMembers = useMemo(() => {
    const q = memberQuery.toLowerCase().trim();

    if (!q) return members;

    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, memberQuery]);

  const selectedMemberStats = useMemo(() => {
    if (!selectedMemberId) return null;

    const stats: Record<DayKey, number[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Weekly: [],
    };

    for (const week of weeks) {
      const member = week.members.find((m) => m.id === selectedMemberId);
      if (!member) continue;

      for (const day of DAYS) {
        const val = member.values[day];
        if (val != null) {
          stats[day].push(val);
        }
      }
    }

    return stats;
  }, [weeks, selectedMemberId]);

  const selectedMemberSummary = useMemo(() => {
    if (!selectedMemberStats) return null;

    const summary = {} as Record<
      DayKey,
      {
        best: number;
        avg: number;
        total: number;
        worst: number;
        entries: number;
        uniqueEntries: number;
        showSpread: boolean;
      }
    >;

    for (const day of DAYS) {
      const arr = selectedMemberStats[day];

      const entries = arr.length;

      const uniqueArr = Array.from(new Set(arr));
      const uniqueEntries = uniqueArr.length;

      const total = entries ? arr.reduce((a, b) => a + b, 0) : 0;
      const avg = entries ? total / entries : 0;

      const best = entries ? Math.max(...arr) : 0;

      const showSpread = uniqueEntries > 1;

      const worst = showSpread ? Math.min(...arr) : best;

      summary[day] = {
        best,
        avg,
        total,
        worst,
        entries,
        uniqueEntries,
        showSpread,
      };
    }

    return summary;
  }, [selectedMemberStats]);

  const selectedMemberWeeklyRows = useMemo(() => {
    if (!selectedMemberId) return [];

    return weeks.map((week) => {
      const member = week.members.find((m) => m.id === selectedMemberId);

      const values: Record<DayKey, number | null> = {
        Mon: member?.values.Mon ?? null,
        Tue: member?.values.Tue ?? null,
        Wed: member?.values.Wed ?? null,
        Thu: member?.values.Thu ?? null,
        Fri: member?.values.Fri ?? null,
        Sat: member?.values.Sat ?? null,
        Weekly: member?.values.Weekly ?? null,
      };

      return {
        week: week.week,
        values,
      };
    });
  }, [weeks, selectedMemberId]);

  const START_DAILY = 400_000;
  const END_DAILY = 3_000_000;

  const START_WEEKLY = 3_000_000;
  const END_WEEKLY = 18_000_000;

  function getRequirement(day: DayKey, weekName?: string) {
    const isWeekly = day === "Weekly";

    const weekIndex = weekName ? getWeekIndex(weekName) : 1;
    const startWeekIndex = getWeekIndex("W4"); // your W4 start point

    // before W4
    if (weekIndex < startWeekIndex) {
      return isWeekly ? START_WEEKLY : START_DAILY;
    }

    const clampedWeek = Math.min(weekIndex, startWeekIndex + TOTAL_WEEKS);

    const progress = (clampedWeek - startWeekIndex) / TOTAL_WEEKS;

    const start = isWeekly ? START_WEEKLY : START_DAILY;
    const end = isWeekly ? END_WEEKLY : END_DAILY;

    const value = start + (end - start) * progress;

    return Math.round(value / 50_000) * 50_000;
  }

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

  function getSuccessRepeatColor(count: number) {
    if (count >= 7) {
      return "border-emerald-400/70 bg-emerald-500/15 text-emerald-200";
    }

    if (count >= 6) {
      return "border-green-400/70 bg-green-500/15 text-green-200";
    }

    if (count >= 5) {
      return "border-lime-400/70 bg-lime-500/15 text-lime-200";
    }

    if (count >= 4) {
      return "border-cyan-400/70 bg-cyan-500/15 text-cyan-200";
    }

    if (count >= 3) {
      return "border-blue-400/70 bg-blue-500/15 text-blue-200";
    }

    if (count >= 2) {
      return "border-indigo-400/70 bg-indigo-500/15 text-indigo-200";
    }

    return "border-gray-700 bg-gray-900 text-gray-300";
  }

  function getFailureRepeatColor(count: number) {
    if (count >= 7) {
      return "border-red-500/70 bg-red-500/15 text-red-200";
    }

    if (count >= 6) {
      return "border-orange-500/70 bg-orange-500/15 text-orange-200";
    }

    if (count >= 5) {
      return "border-amber-500/70 bg-amber-500/15 text-amber-200";
    }

    if (count >= 4) {
      return "border-yellow-500/70 bg-yellow-500/15 text-yellow-200";
    }

    if (count >= 3) {
      return "border-fuchsia-500/70 bg-fuchsia-500/15 text-fuchsia-200";
    }

    if (count >= 2) {
      return "border-pink-500/70 bg-pink-500/15 text-pink-200";
    }

    return "border-gray-700 bg-gray-900 text-gray-300";
  }

  return (
    <div className="p-3 sm:p-4 space-y-6">
      {/* TABS (mobile scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["weekly", "alltime", "members"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab as "weekly" | "alltime" | "members")
            }
            className={`whitespace-nowrap px-4 py-2 rounded text-sm transition ${
              activeTab === tab
                ? "bg-blue-800 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {tab === "weekly"
              ? "Weekly"
              : tab === "alltime"
                ? "All Time"
                : "Members"}
          </button>
        ))}
      </div>

      {/* WEEKLY */}
      {activeTab === "weekly" && (
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
                  <h2 className="text-lg font-bold text-white">
                    Top 10 Presence
                  </h2>

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
                  <h2 className="text-lg font-bold text-white">
                    Repeat Failures
                  </h2>

                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                    {weeklyMemberInsights.repeatingFailures.length} Members
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  Members failing multiple requirements and failing the weekly
                  requirement. As a result, people displayed here have a
                  potential to be kicked.
                </p>
              </div>

              <div className="p-4 flex flex-wrap gap-2">
                {weeklyMemberInsights.repeatingFailures.map(
                  ({ member, count }) => (
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
                  ),
                )}
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
              const requirement = getRequirement(
                day,
                selectedWeek?.week ?? "W1",
              );
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
      )}

      {/* ALL TIME */}
      {activeTab === "alltime" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">All-Time Rankings</h2>

          <div className="flex gap-4 overflow-x-auto snap-x pb-2">
            {allTimeRankings.map(({ day, top10 }) => (
              <div
                key={day}
                className="min-w-65 snap-start rounded-2xl border border-gray-800 bg-gray-950"
              >
                <div className="h-1 bg-linear-to-r from-blue-500/40 to-cyan-500/40" />

                <div className="p-3 text-center text-sm text-gray-200">
                  {getDayLabel(day)}
                </div>

                <div className="border-t border-gray-800" />

                <div className="p-3 space-y-1 text-sm">
                  {top10.map((m, i) => (
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
                      <span className="tabular-nums text-gray-200">
                        {m.score.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Search */}
          <input
            value={memberQuery}
            onChange={(e) => setMemberQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {/* Member picker */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-h-36 overflow-y-auto">
            {filteredMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`p-2 rounded text-sm transition ${
                  selectedMemberId === m.id
                    ? "bg-blue-700 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* STATS */}
          {selectedMemberId && selectedMemberStats && (
            <div className="space-y-6 mt-4">
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {DAYS.map((day) => {
                  const s = selectedMemberSummary?.[day];

                  return (
                    <div
                      key={day}
                      className="bg-gray-950 border border-gray-800 rounded-xl p-3"
                    >
                      <div className="text-xs text-gray-400 mb-2">
                        {getDayLabel(day)}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] text-gray-500">Best</div>
                          <div className="text-yellow-400 font-bold tabular-nums">
                            {s?.best ?? 0}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-500">Avg</div>
                          <div className="text-blue-300 font-medium tabular-nums">
                            {s?.avg?.toFixed(1) ?? 0}
                          </div>
                        </div>

                        {s?.showSpread && (
                          <div>
                            <div className="text-[10px] text-gray-500">
                              Worst
                            </div>
                            <div className="text-orange-400 font-bold tabular-nums">
                              {s?.worst ?? 0}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="text-[10px] text-gray-500">
                            Entries
                          </div>
                          <div className="text-gray-200 tabular-nums">
                            {s?.entries ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WEEKLY ROWS */}
              {selectedMemberWeeklyRows?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-200">
                    Weekly Breakdown
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-150 text-sm text-gray-300 border border-gray-800 rounded-lg overflow-hidden">
                      <thead className="bg-gray-900 text-gray-400">
                        <tr>
                          <th className="p-2 text-left">Week</th>
                          {DAYS.map((day) => (
                            <th key={day} className="p-2 text-right">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {selectedMemberWeeklyRows.map((row) => (
                          <tr
                            key={row.week}
                            className="border-t border-gray-800 hover:bg-gray-900/40"
                          >
                            <td className="p-2 text-gray-200 font-medium">
                              {row.week}
                            </td>

                            {DAYS.map((day) => (
                              <td
                                key={day}
                                className="p-2 text-right tabular-nums"
                              >
                                {row.values[day] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
