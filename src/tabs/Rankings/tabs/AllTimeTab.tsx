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
};

export default function AllTimeTab({ members, weeks, getDayLabel }: Props) {
  const {
    allTimeRankings,
    allTimeInsights,
    allTimeTop100ByDay,
    bottomTop100ByDay,
  } = useAllTimeInsights(members, weeks);
  const [selectedMemberId, setSelectedMemberId] = useState<Set<string>>(
    new Set(),
  );
  const [viewMode, setViewMode] = useState<"top" | "bottom">("top");

  const toggleMemberFocus = (name: string) => {
    setSelectedMemberId((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* ALL TIME RANKINGS */}
      <div>
        <h2 className="text-xl font-bold text-white">All-Time Rankings</h2>

        <div className="flex gap-4 overflow-x-auto snap-x pb-2">
          {allTimeRankings.map(({ day, top10 }) => (
            <DayCard
              key={day}
              day={day}
              top10={top10}
              getDayLabel={getDayLabel}
            />
          ))}
        </div>
      </div>

      {/* TOP / BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectionCard
          title="Top Players"
          description="Most Top 10 appearances across all weeks"
          accent="cyan"
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
          className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointers ${
            viewMode === "top"
              ? "bg-cyan-600 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          Top 100
        </button>

        <button
          onClick={() => setViewMode("bottom")}
          className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer ${
            viewMode === "bottom"
              ? "bg-red-600 text-white"
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
