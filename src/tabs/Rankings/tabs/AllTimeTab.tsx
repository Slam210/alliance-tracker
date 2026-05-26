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
  const { allTimeRankings, allTimeInsights, allTimeTop100ByDay } =
    useAllTimeInsights(members, weeks);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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
                setSelectedMemberId={setSelectedMemberId}
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
                setSelectedMemberId={setSelectedMemberId}
              />
            ))}
          </div>
        </SectionCard>
      </div>
      {/* ALL TIME TOP 100 */}
      <AllTimeDayCard
        getDayLabel={getDayLabel}
        allTimeTop100ByDay={allTimeTop100ByDay}
        selectedMemberId={selectedMemberId}
        setSelectedMemberId={setSelectedMemberId}
      />
    </div>
  );
}
