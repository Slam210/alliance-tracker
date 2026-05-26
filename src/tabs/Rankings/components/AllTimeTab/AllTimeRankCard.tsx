import type { DayKey } from "../../../../types/week";
import RankingRow from "./RankingRow";

type DayCardProps = {
  day: DayKey;
  top10: { id: string; name: string; score: number }[];
  getDayLabel: (day: DayKey) => string;
};

export default function DayCard({ day, top10, getDayLabel }: DayCardProps) {
  return (
    <div className="min-w-65 snap-start rounded-2xl border border-gray-800 bg-gray-950">
      <div className="h-1 bg-linear-to-r from-blue-500/40 to-cyan-500/40" />

      <div className="p-3 text-center text-sm text-gray-200">
        {getDayLabel(day)}
      </div>

      <div className="border-t border-gray-800" />

      <div className="p-3 space-y-1 text-sm">
        {top10.map((m, i) => (
          <RankingRow key={m.id} rank={i + 1} name={m.name} score={m.score} />
        ))}
      </div>
    </div>
  );
}
