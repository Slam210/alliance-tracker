export default function RankingRow({
  rank,
  name,
  score,
}: {
  rank: number;
  name: string;
  score: number;
}) {
  const isTopThree = rank <= 3;

  return (
    <div
      className="
        flex items-center justify-between
        rounded-lg px-2 py-1.5
        text-sm
        transition-all duration-150
        hover:bg-white/5
        hover:shadow-sm hover:shadow-black/30
      "
    >
      {/* Left side */}
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={`
            w-6 text-right text-xs font-semibold tabular-nums
            ${isTopThree ? "text-amber-300" : "text-gray-500"}
          `}
        >
          {rank}
        </span>

        <span className="truncate text-gray-200" title={name}>
          {name}
        </span>
      </span>

      {/* Right side */}
      <span className="ml-3 shrink-0 tabular-nums font-semibold text-gray-100">
        {score.toLocaleString()}
      </span>
    </div>
  );
}
