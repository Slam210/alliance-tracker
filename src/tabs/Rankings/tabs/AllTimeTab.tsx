import { useMemo } from "react";
import type { DayKey, Week } from "../../../types/week";
import { DAYS } from "../constants/days";
import type { Member } from "../../../types/member";
import type { RankedEntry } from "../../../types/derived/rankings";

type Props = {
  members: Member[];
  weeks: Week[];
  getDayLabel: (day: DayKey) => string;
};

export default function AllTimeTab({ members, weeks, getDayLabel }: Props) {
  const activeMemberIds = useMemo(() => {
    return new Set(
      members.filter((m) => m.status === "Active").map((m) => m.id),
    );
  }, [members]);
  const isExcluded = (member: { exception?: boolean }) =>
    member.exception === true;

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

  /* ALL TIME MEMBER INSIGHTS */
  const allTimeInsights = useMemo(() => {
    const topCounts = new Map<
      string,
      { member: { id: string; name: string }; count: number }
    >();

    const failureCounts = new Map<
      string,
      { member: { id: string; name: string }; count: number }
    >();

    for (const week of weeks) {
      for (const member of week.members) {
        if (!activeMemberIds.has(member.id)) continue;
        if (isExcluded(member)) continue;

        const counters = member.counters;

        const topTotal = counters.daily_top + counters.weekly_top;

        const failTotal = counters.daily_bottom + counters.weekly_bottom;

        // TOP appearances
        if (topTotal > 0) {
          const existing = topCounts.get(member.id);

          if (existing) {
            existing.count += topTotal;
          } else {
            topCounts.set(member.id, {
              member: { id: member.id, name: member.name },
              count: topTotal,
            });
          }
        }

        // FAILURE appearances
        if (failTotal > 0) {
          const existing = failureCounts.get(member.id);

          if (existing) {
            existing.count += failTotal;
          } else {
            failureCounts.set(member.id, {
              member: { id: member.id, name: member.name },
              count: failTotal,
            });
          }
        }
      }
    }

    return {
      topPlayers: Array.from(topCounts.values()).sort(
        (a, b) => b.count - a.count,
      ),

      bottomPlayers: Array.from(failureCounts.values()).sort(
        (a, b) => b.count - a.count,
      ),
    };
  }, [weeks, activeMemberIds]);

  return (
    <div className="space-y-4">
      <div>
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Players */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-cyan-500/60 to-blue-500/40" />

          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">Top Players</h2>

            <p className="text-sm text-gray-400 mt-1">
              Most Top 10 appearances across all weeks
            </p>
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            {allTimeInsights.topPlayers.map(({ member, count }) => (
              <div
                key={member.id}
                className="px-3 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10"
              >
                <div className="flex items-center gap-2">
                  <span>{member.name}</span>

                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                    {count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Players */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-red-500/60 to-orange-500/40" />

          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">Bottom Players</h2>

            <p className="text-sm text-gray-400 mt-1">
              Most failed requirements across all weeks
            </p>
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            {allTimeInsights.bottomPlayers.map(({ member, count }) => (
              <div
                key={member.id}
                className="px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10"
              >
                <div className="flex items-center gap-2">
                  <span>{member.name}</span>

                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                    {count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
