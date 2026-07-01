import type { Week } from "../../../../types/week";
import type { RankingsByEvent } from "../../../../types/derived/rankings";

import { EVENTS } from "../../constants/days";
import { getRequirement } from "../../utils/scoring";
import DailyRankingCard from "./DailyRankCard";
import { isExcluded } from "../../utils/week";
import { AllianceSettings } from "../../../../types/settings";

type Props = {
  allRankingsByEvent: RankingsByEvent | undefined;
  selectedWeek: Week | undefined;
  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
  allianceSettings: AllianceSettings;
};

export default function FailureSection({
  allRankingsByEvent,
  selectedWeek,
  focusedMembers,
  onToggleMember,
  allianceSettings,
}: Props) {
  if (!selectedWeek || !allRankingsByEvent) return null;

  const hasWeeklyData = selectedWeek.members.some(
    (m) => m.values.Weekly != null,
  );

  return (
    <div className="rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 sm:px-6 py-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Below Requirement
        </h2>
      </div>

      {/* Content */}
      <div className="relative p-3 sm:p-4">
        <div className="flex gap-4 overflow-x-auto px-1 sm:px-2 pb-2 no-scrollbar">
          {EVENTS.map((event) => {
            const requirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, selectedWeek.week);

            const failingMembers =
              allRankingsByEvent[event]
                ?.filter((m) => isExcluded(m))
                .filter((m) => m.score < (requirement ?? 0))
                .sort((a, b) => a.score - b.score) ?? [];

            return (
              <DailyRankingCard
                key={event}
                title={event}
                entries={failingMembers}
                emptyMessage={
                  allRankingsByEvent[event]?.length
                    ? hasWeeklyData
                      ? "Everyone passed"
                      : "No failures"
                    : "No data"
                }
                variant="danger"
                focusedMembers={focusedMembers}
                onToggleMember={onToggleMember}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
