import { getMemberNickname } from "../../../../stores/memberStore";

export default function RankingRow({
  id,
  rank,
  name,
  score,
  selectedMemberId,
  toggleMemberFocus,
}: {
  id: string;
  rank: number;
  name: string;
  score: number;
  selectedMemberId: Set<string>;
  toggleMemberFocus: (memberId: string) => void;
}) {
  const isTopThree = rank <= 3;
  const hasSelection = selectedMemberId.size > 0;

  const isDimmed = hasSelection && !selectedMemberId.has(id);
  const nickname = getMemberNickname(id);

  return (
    <div
      onClick={() => toggleMemberFocus(id)}
      className="
        flex items-center justify-between
        rounded-lg px-2 py-1.5
        text-sm
        transition-all duration-150
        hover:bg-white/5
        hover:shadow-sm hover:shadow-black/30
      "
      style={{
        opacity: isDimmed ? 0.12 : 1,
        filter: isDimmed ? "grayscale(100%)" : "none",
      }}
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

        <span
          className="truncate text-gray-200"
          title={nickname ? nickname : name}
        >
          {nickname ? nickname : name}
        </span>
      </span>

      {/* Right side */}
      <span className="ml-3 shrink-0 tabular-nums font-semibold text-gray-100">
        {score.toLocaleString()}
      </span>
    </div>
  );
}
