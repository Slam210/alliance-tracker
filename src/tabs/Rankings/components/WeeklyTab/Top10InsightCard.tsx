import type { WeeklyInsights } from "../../../../types/derived/counting";
import { getSuccessRepeatColor } from "../../utils/colors";

type Props = {
  insights: WeeklyInsights;
};

export default function Top10Insights({ insights }: Props) {
  const { uniqueTop10Members } = insights;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-lg overflow-hidden">
      <div className="h-1 bg-linear-to-r from-cyan-500/60 to-blue-500/40" />

      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Top 10 Presence</h2>

          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {uniqueTop10Members.length} Members
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-1">
          Members appearing across Top 10 rankings
        </p>
      </div>

      <div className="p-4 flex flex-wrap gap-2">
        {uniqueTop10Members.length ? (
          uniqueTop10Members.map(({ member, count }) => (
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
          ))
        ) : (
          <div className="text-sm text-gray-500">No members found</div>
        )}
      </div>
    </div>
  );
}
