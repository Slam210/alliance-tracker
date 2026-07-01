import type { RankingsByEvent } from "../../../../types/derived/rankings";

import { EVENTS } from "../../constants/days";
import DailyRankingCard from "./DailyRankCard";

type Props = {
  rankingsByEvent: RankingsByEvent | undefined;
  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
};

export default function Top10Section({
  rankingsByEvent,
  focusedMembers,
  onToggleMember,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 sm:px-6 py-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">Top 10</h2>
      </div>
      {/* Content */}
      <div className="relative p-3 sm:p-4">
        <div className="flex gap-4 overflow-x-auto pb-2 px-1 sm:px-2 no-scrollbar">
          {EVENTS.map((event) => (
            <DailyRankingCard
              key={event}
              title={event}
              entries={rankingsByEvent?.[event] ?? []}
              emptyMessage="No data"
              variant="success"
              focusedMembers={focusedMembers}
              onToggleMember={onToggleMember}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
