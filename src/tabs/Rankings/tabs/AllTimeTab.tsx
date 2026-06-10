import type { DayKey, Week } from "../../../types/week";
import type { Member } from "../../../types/member";
import { useAllTimeInsights } from "../hooks/useAllTimeInsights";
import SectionCard from "../components/AllTimeTab/SectionCard";
import MemberChip from "../components/AllTimeTab/MemberChip";
import DayCard from "../components/AllTimeTab/AllTimeRankCard";
import AllTimeDayCard from "../components/AllTimeTab/AllTimeDayCard";
import { useState } from "react";

type Props = {
  members: Member[];
  weeks: Week[];
  getDayLabel: (day: DayKey) => string;
  selectedMemberId: Set<string>;
  setSelectedMemberId: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export default function AllTimeTab({
  members,
  weeks,
  getDayLabel,
  selectedMemberId,
  setSelectedMemberId,
}: Props) {
  const {
    allTimeRankings,
    allTimeInsights,
    allTimeTop100ByDay,
    bottomTop100ByDay,
  } = useAllTimeInsights(members, weeks);

  const [viewMode, setViewMode] = useState<"top" | "bottom">("top");

  const toggleMemberFocus = (memberId: string) => {
    setSelectedMemberId((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* ALL TIME RANKINGS */}
      <div className="w-full">
        {/* Section Card */}
        <div className="rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg">
          {/* Header */}
          <div className="px-4 sm:px-6 py-3">
            <h2 className="text-xl font-bold text-white">All-Time Rankings</h2>
          </div>

          <div className="border-t border-gray-800" />

          {/* Scroll Area */}
          <div className="relative p-3 sm:p-4">
            <div className="flex gap-4 overflow-x-auto snap-x pb-2 no-scrollbar px-1 sm:px-2">
              {allTimeRankings.map(({ day, top10 }) => (
                <DayCard
                  key={day}
                  day={day}
                  top10={top10}
                  getDayLabel={getDayLabel}
                  selectedMemberId={selectedMemberId}
                  toggleMemberFocus={toggleMemberFocus}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* TOP / BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectionCard
          title="Top Players"
          description="Most Top 10 appearances across all weeks"
          accent="cyan"
          count={allTimeInsights.topPlayers.length}
        >
          <div className="flex flex-wrap gap-2">
            {allTimeInsights.topPlayers.map(({ member, count }) => (
              <MemberChip
                key={member.id}
                id={member.id}
                name={member.name}
                count={count}
                selectedMemberId={selectedMemberId}
                onToggleMember={toggleMemberFocus}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Bottom Players"
          description="Most failed requirements across all weeks"
          accent="red"
          count={allTimeInsights.bottomPlayers.length}
        >
          <div className="flex flex-wrap gap-2">
            {allTimeInsights.bottomPlayers.map(({ member, count }) => (
              <MemberChip
                key={member.id}
                id={member.id}
                name={member.name}
                count={count}
                selectedMemberId={selectedMemberId}
                onToggleMember={toggleMemberFocus}
              />
            ))}
          </div>
        </SectionCard>
      </div>
      {/* TOP / BOTTOM SWITCH */}
      <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg w-fit">
        <button
          onClick={() => setViewMode("top")}
          className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointers border border-white ${
            viewMode === "top"
              ? "bg-green-500 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          Top 100
        </button>

        <button
          onClick={() => setViewMode("bottom")}
          className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer border border-white ${
            viewMode === "bottom"
              ? "bg-red-500 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          Bottom 100
        </button>
      </div>

      {/* CONDITIONAL CARD */}
      <AllTimeDayCard
        getDayLabel={getDayLabel}
        allTimeTop100ByDay={
          viewMode === "top" ? allTimeTop100ByDay : bottomTop100ByDay
        }
        selectedMemberId={selectedMemberId}
        onToggleMember={toggleMemberFocus}
        title={viewMode === "top" ? "Top" : "Bottom"}
      />
    </div>
  );
}
