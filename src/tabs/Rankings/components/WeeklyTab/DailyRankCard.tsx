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
      className={`
        w-72 sm:w-80
        shrink-0 snap-start
        relative rounded-2xl
        bg-gray-950 shadow-lg border
        ${variantStyles[variant].border}
      `}
    >
      {/* Top glow bar */}
      <div
        className={`h-1 bg-linear-to-r ${variantStyles[variant].glow} rounded-t-2xl`}
      />

      {/* Header */}
      <div className="px-4 py-3 text-center">
        <div className="text-sm font-semibold tracking-wide text-gray-100">
          {title}
        </div>
      </div>

      <div className="border-t border-gray-800" />

      {/* Entries */}
      <div className="min-h-102 p-3 space-y-2 text-sm">
        {entries.length ? (
          entries.map((entry, index) => {
            const isFocused =
              focusedMembers.size === 0 || focusedMembers.has(entry.name);

            return (
              <div
                key={entry.id}
                onClick={() => onToggleMember(entry.name)}
                className={`
                  flex items-start justify-between
                  rounded-lg px-2 py-1.5
                  cursor-pointer
                  transition-all duration-150

                  hover:bg-white/5
                  hover:shadow-md
                  hover:shadow-black/40

                  ${isFocused ? "opacity-100" : "opacity-40 grayscale"}
                `}
              >
                {/* Left side */}
                <span className="flex min-w-0 flex-1 items-start gap-2">
                  <span
                    className={`
                      w-6 text-right text-xs font-semibold tabular-nums
                      ${index < 3 ? (variant === "success" ? "text-amber-300" : "text-red-300") : "text-gray-500"}
                    `}
                  >
                    {index + 1}
                  </span>

                  <span className="truncate text-gray-200" title={entry.name}>
                    {entry.name}
                  </span>
                </span>

                {/* Right value */}
                <span
                  className={`
                    ml-3 shrink-0
                    tabular-nums font-semibold
                    ${variantStyles[variant].valueText}
                  `}
                >
                  {renderRightValue
                    ? renderRightValue(entry)
                    : entry.score.toLocaleString()}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-96 items-center justify-center text-center text-xs text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
