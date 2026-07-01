import type { EventKey } from "../../../../types/week";
import RankingRow from "./RankingRow";

type EventCardProps = {
  event: EventKey;
  top10: { id: string; name: string; score: number }[];
  selectedMemberId: Set<string>;
  toggleMemberFocus: (memberId: string) => void;
};

export default function EventCard({
  event,
  top10,
  selectedMemberId,
  toggleMemberFocus,
}: EventCardProps) {
  return (
    <div
      className="
        w-72 sm:w-80
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
          {event}
        </div>
      </div>

      <div className="border-t border-gray-800" />

      {/* Entries */}
      <div className="min-h-102 p-3 space-y-1 text-sm">
        {top10.slice(0, 10).map((m, i) => (
          <RankingRow
            key={m.id}
            id={m.id}
            rank={i + 1}
            name={m.name}
            score={m.score}
            selectedMemberId={selectedMemberId}
            toggleMemberFocus={toggleMemberFocus}
          />
        ))}
      </div>
    </div>
  );
}
