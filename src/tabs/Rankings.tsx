import { useMemo, useState } from "react";
import type { AllianceDuelEntry, Week } from "../types/week";
import type { Member } from "../types/member";

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

/* COMPONENT */

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
  const bottomRankingsByDay = useMemo(() => {
    if (!selectedWeek) return {} as Record<DayKey, RankedEntry[]>;

    const result = {} as Record<DayKey, RankedEntry[]>;

    for (const day of DAYS) {
      result[day] = selectedWeek.members
        .map((member) => {
          const score = member.values[day];
          return score != null ? { ...member, score } : null;
        })
        .filter((m): m is RankedEntry => m !== null)
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);
    }

    return result;
  }, [selectedWeek]);

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

  return (
    <div className="p-4 space-y-6">
      {/* TABS */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`px-4 py-1 rounded ${
            activeTab === "weekly" ? "bg-blue-800 text-white" : "bg-gray-800"
          }`}
        >
          Weekly
        </button>

        <button
          onClick={() => setActiveTab("alltime")}
          className={`px-4 py-1 rounded ${
            activeTab === "alltime" ? "bg-blue-800 text-white" : "bg-gray-800"
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-1 rounded ${
            activeTab === "members" ? "bg-blue-800 text-white" : "bg-gray-800"
          }`}
        >
          Members
        </button>
      </div>
      {/* WEEKLY TAB */}
      {activeTab === "weekly" && (
        <>
          {/* Week Selector */}
          <div className="flex gap-2 flex-wrap">
            {weeks.map((week, i) => (
              <button
                key={week.week}
                onClick={() => setSelectedWeekIndex(i)}
                className={`px-3 py-1 rounded ${
                  i === selectedWeekIndex
                    ? "bg-blue-800 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
                }`}
              >
                {week.week}
              </button>
            ))}
          </div>

          {/* TOP 10 */}
          <h2 className="text-lg font-bold text-gray-200">Top 10</h2>

          <div className="grid grid-cols-7 gap-3 bg-gray-950 text-gray-100 p-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="group relative rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg shadow-black/30 hover:shadow-blue-500/10 transition-all"
              >
                {/* Accent bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-70 group-hover:opacity-100 transition
        ${
          day === "Weekly"
            ? "bg-linear-to-r from-green-500/60 via-emerald-400/40 to-lime-500/50"
            : "bg-linear-to-r from-green-600/30 via-emerald-500/20 to-green-600/30"
        }
      `}
                />

                {/* Header */}
                <div className="px-3 pt-4 pb-2 text-center">
                  <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
                    {getDayLabel(day)}
                  </h2>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800/70 mx-3 mb-2" />

                {/* Content */}
                <div className="px-3 pb-4 flex flex-col gap-1.5 text-sm">
                  {rankingsByDay[day]?.length ? (
                    rankingsByDay[day].map((member, index) => {
                      const isTop3 = index < 3;

                      return (
                        <div
                          key={`${day}-${member.id}`}
                          className={`flex justify-between items-center rounded-lg px-2 py-1 transition
                ${isTop3 ? "bg-gray-800/40" : "hover:bg-gray-800/20"}
              `}
                        >
                          {/* Left */}
                          <span
                            className={`truncate flex items-center gap-2 ${
                              index === 0
                                ? "text-yellow-400 font-semibold"
                                : index === 1
                                  ? "text-gray-300 font-medium"
                                  : index === 2
                                    ? "text-orange-400 font-medium"
                                    : "text-gray-300"
                            }`}
                          >
                            <span className="text-xs text-gray-500 w-5 text-right">
                              {index + 1}
                            </span>
                            {member.name}
                          </span>

                          {/* Right */}
                          <span className="tabular-nums font-medium text-gray-200">
                            {member.score.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-gray-500 py-6">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM 10 */}
          <h2 className="text-lg font-bold text-gray-200 mt-6">Bottom 10</h2>

          <div className="grid grid-cols-7 gap-3 bg-gray-950 text-gray-100 p-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="group relative rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg shadow-black/30 hover:shadow-red-500/10 transition-all"
              >
                {/* Accent bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-70 group-hover:opacity-100 transition
        ${
          day === "Weekly"
            ? "bg-linear-to-r from-red-500/60 via-red-400/40 to-orange-500/50"
            : "bg-linear-to-r from-red-600/30 via-red-500/20 to-red-600/30"
        }
      `}
                />

                {/* Header */}
                <div className="px-3 pt-4 pb-2 text-center">
                  <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
                    {getDayLabel(day)}
                  </h2>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800/70 mx-3 mb-2" />

                {/* Content */}
                <div className="px-3 pb-4 flex flex-col gap-1.5 text-sm">
                  {bottomRankingsByDay[day]?.length ? (
                    bottomRankingsByDay[day].map((member, index) => {
                      const isBottom3 = index < 3;

                      return (
                        <div
                          key={`${day}-${member.id}`}
                          className={`flex justify-between items-center rounded-lg px-2 py-1 transition
                ${isBottom3 ? "bg-red-900/20" : "hover:bg-gray-800/20"}
              `}
                        >
                          {/* Left */}
                          <span className="text-gray-300 truncate flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-5 text-right">
                              {index + 1}
                            </span>
                            {member.name}
                          </span>

                          {/* Right */}
                          <span className="tabular-nums font-medium text-red-400">
                            {member.score.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-gray-500 py-6">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* ALL TIME TAB */}
      {activeTab === "alltime" && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              All-Time Rankings
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {allTimeRankings.map(({ day, top10 }) => (
              <div
                key={day}
                className="group relative rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg shadow-black/30 hover:shadow-blue-500/10 transition-all"
              >
                {/* Glow accent */}
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-linear-to-r from-blue-500/40 via-purple-500/30 to-cyan-500/40 opacity-60 group-hover:opacity-100 transition" />

                {/* Header */}
                <div className="px-3 pt-4 pb-2 text-center">
                  <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
                    {getDayLabel(day)}
                  </h2>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800/70 mx-3 mb-2" />

                {/* List */}
                <div className="px-3 pb-4 flex flex-col gap-1.5">
                  {top10.length ? (
                    top10.map((member, index) => {
                      const isTop3 = index < 3;

                      return (
                        <div
                          key={`${day}-${member.id}`}
                          className={`flex justify-between items-center rounded-lg px-2 py-1 transition
                      ${isTop3 ? "bg-gray-800/40" : "hover:bg-gray-800/20"}
                    `}
                        >
                          {/* Left */}
                          <span
                            className={`truncate text-sm flex items-center gap-2 ${
                              index === 0
                                ? "text-yellow-400 font-semibold"
                                : index === 1
                                  ? "text-gray-300 font-medium"
                                  : index === 2
                                    ? "text-orange-400 font-medium"
                                    : "text-gray-300"
                            }`}
                          >
                            <span className="text-xs text-gray-500 w-5 text-right">
                              {index + 1}
                            </span>
                            {member.name}
                          </span>

                          {/* Right */}
                          <span className="text-sm tabular-nums font-medium text-gray-200">
                            {member.score.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-gray-500 py-6">
                      No data available
                    </div>
                  )}
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
             focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />

          {/* Member list (scrollable) */}
          <div
            className="mt-3 grid grid-cols-3 md:grid-cols-5 gap-2
             max-h-36 overflow-y-auto pr-2
             custom-scrollbar"
          >
            {filteredMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`p-2 rounded-lg text-center text-sm transition-all duration-150
        border border-transparent hover:border-gray-600 hover:scale-[1.02] 
        ${
          selectedMemberId === m.id
            ? "bg-blue-700 text-white shadow-md shadow-blue-900/40"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
              >
                <span className="truncate block">{m.name}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          {selectedMemberId && selectedMemberStats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-6">
                {DAYS.map((day) => {
                  const s = selectedMemberSummary?.[day];

                  return (
                    <div
                      key={day}
                      className="bg-linear-to-b from-gray-950 to-gray-900
                     border border-gray-800 rounded-xl p-4
                     shadow-lg shadow-black/30"
                    >
                      {/* Header */}
                      <div className="text-sm text-gray-300 font-semibold mb-3">
                        {getDayLabel(day)}
                      </div>

                      {/* Stats */}
                      <div className="space-y-3">
                        {/* BEST */}
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            Best
                          </div>
                          <div className="text-2xl font-bold text-yellow-400 tabular-nums">
                            {s?.best ?? 0}
                          </div>
                        </div>

                        {/* AVG */}
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            Average
                          </div>
                          <div className="text-xl font-semibold text-blue-300 tabular-nums">
                            {s?.avg.toFixed(1) ?? 0}
                          </div>
                        </div>
                        {/* Worst */}
                        {s && s.showSpread && (
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Worst
                            </div>
                            <div className="text-2xl font-bold text-yellow-400 tabular-nums">
                              {s?.worst ?? 0}
                            </div>
                          </div>
                        )}

                        {/* ENTRIES */}
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            Entries
                          </div>
                          <div className="text-lg font-medium text-gray-200 tabular-nums">
                            {s?.entries ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* WEEKLY ROWS */}
              {selectedMemberId && selectedMemberWeeklyRows.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-200 mb-3">
                    Weekly Breakdown
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-300 border border-gray-800 rounded-lg overflow-hidden">
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
                            {/* Week label */}
                            <td className="p-2 text-gray-200 font-medium">
                              {row.week}
                            </td>

                            {/* Values */}
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
            </>
          )}
        </div>
      )}{" "}
    </div>
  );
}
