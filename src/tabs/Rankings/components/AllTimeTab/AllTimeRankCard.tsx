import type { DayKey } from "../../../../types/week";
import RankingRow from "./RankingRow";

type DayCardProps = {
  day: DayKey;
  top10: { id: string; name: string; score: number }[];
  getDayLabel: (day: DayKey) => string;
};

export default function DayCard({ day, top10, getDayLabel }: DayCardProps) {
  return (
    <div
      className="
        w-72 sm:w-80
        shrink-0 snap-start
        rounded-2xl
        border border-gray-800
        bg-linear-to-b from-gray-900 to-gray-950
        shadow-lg
      "
    >
      {/* Top glow bar */}
      <div className="h-1 bg-linear-to-r from-blue-500/40 to-cyan-500/40 rounded-t-2xl" />

      {/* Header */}
      <div className="px-4 py-3 text-center">
        <div className="text-sm font-semibold tracking-wide text-gray-100">
          {getDayLabel(day)}
        </div>
      </div>

      <div className="border-t border-gray-800" />

      {/* Entries */}
      <div className="min-h-102 p-3 space-y-1 text-sm">
        {top10.map((m, i) => (
          <RankingRow key={m.id} rank={i + 1} name={m.name} score={m.score} />
        ))}
      </div>
    </div>
  );
}
