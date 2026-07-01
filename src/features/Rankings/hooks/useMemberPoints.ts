import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import type { StateRulerResponse } from "../../../types/stateRuler";
import type { MemberWithPoints, PointRule } from "../../../types/derived/eos";
import type { WeeklyDailyRankings } from "../../../types/derived/eos";
import type { AdjustmentLog } from "../../../types/log";
import { applyAllianceDuelPoints } from "../utils/points/applyAllianceDuelPoints";
import { applyEOSBonuses } from "../utils/points/applyEOSBonuses";
import { applyStateRulerPoints } from "../utils/points/applyStateRulerPoints";
import { useApp } from "../../../hooks/useApp";

export function useMemberPoints(
  members: Member[],
  rankings: WeeklyDailyRankings,
  stateRulerData: StateRulerResponse | undefined,
  pointRules: PointRule[],
  logs: AdjustmentLog[],
) {
  const [search, setSearch] = useState("");
  const { allianceSettings } = useApp();

  // BUILD FULL BASE DATASET (NO SEARCH HERE)
  const baseMembers = useMemo(() => {
    return members
      .filter((member) => member.status === "Active")
      .reduce<Record<string, MemberWithPoints>>((acc, member) => {
        acc[member.id] = {
          ...member,
          points: 0,
          logs: [],
        };
        return acc;
      }, {});
  }, [members]);

  // APPLY ALL SCORING LOGIC (GLOBAL, UNFILTERED)
  const computedMemberPoints = useMemo(() => {
    if (!allianceSettings) return;
    if (!allianceSettings.settings.start_date) return;

    const result: Record<string, MemberWithPoints> = structuredClone(
      baseMembers,
    );

    const startDate = allianceSettings.settings.start_date;

    applyAllianceDuelPoints(result, rankings, pointRules, startDate);
    applyStateRulerPoints(result, stateRulerData, pointRules);
    applyEOSBonuses(result, pointRules, logs);

    return result;
  }, [
    baseMembers,
    rankings,
    stateRulerData,
    pointRules,
    logs,
    allianceSettings,
  ]);

  // FINAL MEMBER POINTS (GLOBAL DATASET)
  const memberPoints = useMemo(() => {
    return computedMemberPoints ?? {};
  }, [computedMemberPoints]);

  return {
    memberPoints,
    search,
    setSearch,
  };
}
