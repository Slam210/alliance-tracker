import type { WeeklyInsights } from "../../../../types/derived/counting";
import { getFailureRepeatColor } from "../../utils/colors";

type Props = {
  insights: WeeklyInsights;
  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
};

export default function FailureInsights({
  insights,
  focusedMembers,
  onToggleMember,
}: Props) {
  const { repeatingFailures, hasWeeklyData } = insights;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-lg overflow-hidden">
      <div className="h-1 bg-linear-to-r from-red-500/60 to-orange-500/40" />

      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Repeat Failures</h2>

          <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
            {repeatingFailures.length} Members
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-1">
          {hasWeeklyData
            ? "Members failing at least one daily requirement and the weekly requirement."
            : "Weekly data not entered yet. Showing daily failures only."}
        </p>
      </div>

      <div className="p-4">
        {!hasWeeklyData && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200 mb-3">
            Weekly data is yet to be input.
          </div>
        )}

        {repeatingFailures.length ? (
          <div className="flex flex-wrap gap-2">
            {repeatingFailures.map(({ member, count }) => {
              const isFocused =
                focusedMembers.size === 0 || focusedMembers.has(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => onToggleMember(member.id)}
                  className={`
                  px-3 py-2 rounded-xl border cursor-pointer
                  ${getFailureRepeatColor(count)}
                  ${isFocused ? "opacity-100" : "opacity-30 text-gray-500"}
                `}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>

                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                      {count}x
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasWeeklyData ? (
          <div className="text-sm text-green-400">
            🎉 Everyone passed their daily + weekly requirements.
          </div>
        ) : (
          <div className="text-sm text-gray-500">No daily failures yet.</div>
        )}
      </div>
    </div>
  );
}
