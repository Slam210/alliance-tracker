import { useMemo } from "react";
import type { AllianceDuelEntry, DayKey, Week } from "../../../types/week";
import { DAYS } from "../constants/days";
import type { Member } from "../../../types/member";

export type RankedEntry = AllianceDuelEntry & { score: number };

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

  return (
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
                <div key={m.id} className="flex justify-between text-gray-300">
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
  );
}
