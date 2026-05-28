import type { RankedEntry } from "../../../../types/derived/rankings";

type Variant = "success" | "danger";

type Props = {
  title: string;
  entries: RankedEntry[];
  emptyMessage?: string;
  variant?: Variant;
  renderRightValue?: (entry: RankedEntry) => string | number;

  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
};

const variantStyles: Record<
  Variant,
  {
    glow: string;
    border: string;
    valueText: string;
  }
> = {
  success: {
    glow: "from-green-500/60 to-lime-500/40",
    border: "border-green-500/20",
    valueText: "text-green-300",
  },
  danger: {
    glow: "from-red-500/60 to-orange-500/40",
    border: "border-red-500/20",
    valueText: "text-red-300",
  },
};

export default function DailyRankingCard({
  title,
  entries,
  emptyMessage = "No data",
  variant = "success",
  renderRightValue,
  focusedMembers,
  onToggleMember,
}: Props) {
  return (
    <div
      className={`min-w-72 snap-start relative rounded-2xl bg-gray-950 shadow-lg border ${
        variantStyles[variant].border
      }`}
    >
      {/* top glow bar */}
      <div
        className={`h-1 bg-linear-to-r ${variantStyles[variant].glow} rounded-t-2xl`}
      />

      {/* title */}
      <div className="p-3 text-center">
        <div className="text-sm font-semibold text-gray-200">{title}</div>
      </div>

      <div className="border-t border-gray-800" />

      {/* entries */}
      <div className="p-3 space-y-2 text-sm">
        {entries.length ? (
          entries.map((entry, index) => {
            const isFocused =
              focusedMembers.size === 0 || focusedMembers.has(entry.name);

            return (
              <div
                key={entry.id}
                onClick={() => onToggleMember?.(entry.name)}
                className={`
                  flex justify-between items-start
                  cursor-pointer
                  rounded-lg px-1 py-1

                  hover:scale-[1.02] hover:-translate-y-0.5
                  hover:bg-white/5 hover:shadow-md hover:shadow-black/40

                  transition

                  ${isFocused ? "opacity-100" : "opacity-30 text-gray-500"}
                `}
              >
                {/* left side */}
                <span className="flex gap-2 items-start">
                  <span className="w-5 text-gray-500 text-xs text-right tabular-nums">
                    {index + 1}
                  </span>

                  <span className="text-gray-200">{entry.name}</span>
                </span>

                {/* right value */}
                <span
                  className={`tabular-nums font-semibold ${
                    variantStyles[variant].valueText
                  }`}
                >
                  {renderRightValue
                    ? renderRightValue(entry)
                    : entry.score.toLocaleString()}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center text-xs text-gray-500 py-6">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
