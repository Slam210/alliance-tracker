import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import type { DayKey, Week } from "../../../types/week";
import { DAYS } from "../constants/days";

type Props = {
  members: Member[];
  weeks: Week[];
  getDayLabel: (day: DayKey) => string;
};

export default function MembersTab({ members, weeks, getDayLabel }: Props) {
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
    <div className="space-y-4">
      {/* Search */}
      <input
        value={memberQuery}
        onChange={(e) => setMemberQuery(e.target.value)}
        placeholder="Search members..."
        className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                        <div className="text-[10px] text-gray-500">Worst</div>
                        <div className="text-orange-400 font-bold tabular-nums">
                          {s?.worst ?? 0}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] text-gray-500">Entries</div>
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
                          <td key={day} className="p-2 text-right tabular-nums">
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
  );
}
