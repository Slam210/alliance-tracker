import type { RankedEntry } from "../../../../types/derived/rankings";

type Variant = "success" | "danger";

type Props = {
  title: string;
  entries: RankedEntry[];
  emptyMessage?: string;
  variant?: Variant;
  renderRightValue?: (entry: RankedEntry) => string | number;
};

const variantStyles: Record<Variant, string> = {
  success: "from-green-500/60 to-lime-500/40 text-green-400",
  danger: "from-red-500/60 to-orange-500/40 text-red-400",
};

export default function DailyRankingCard({
  title,
  entries,
  emptyMessage = "No data",
  variant = "success",
  renderRightValue,
}: Props) {
  return (
    <div className="min-w-65 snap-start relative rounded-2xl border border-gray-800 bg-gray-950 shadow-lg">
      {/* Top gradient bar */}
      <div
        className={`h-1 bg-linear-to-r ${variantStyles[variant]} rounded-t-2xl`}
      />

      {/* Title */}
      <div className="p-3 text-center">
        <div className="text-sm font-semibold text-gray-200">{title}</div>
      </div>

      <div className="border-t border-gray-800" />

      {/* Content */}
      <div className="p-3 space-y-1 text-sm">
        {entries.length ? (
          entries.map((entry, index) => (
            <div key={entry.id} className="flex justify-between text-gray-300">
              <span className="flex gap-2">
                <span className="w-5 text-gray-500 text-xs text-right">
                  {index + 1}
                </span>
                {entry.name}
              </span>

              <span
                className={
                  variant === "danger"
                    ? "text-red-400 tabular-nums"
                    : "text-gray-200 tabular-nums"
                }
              >
                {renderRightValue
                  ? renderRightValue(entry)
                  : entry.score.toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-xs text-gray-500 py-6">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
