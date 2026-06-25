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

  const memberPoints = useMemo(() => {
    const result: Record<string, MemberWithPoints> = {};

    members
      .filter((member) => {
        if (member.status !== "Active") return false;

        if (!search.trim()) return true;

        const name = String(member.nickname || member.name).toLowerCase();

        return name.includes(search.toLowerCase());
      })
      .forEach((member) => {
        result[member.id] = {
          ...member,
          points: 0,
          logs: [],
        };
      });

    if (!allianceSettings) {
      return;
    }

    const ALLIANCE_DUEL_START_DATE = allianceSettings.settings.start_date;

    if (!ALLIANCE_DUEL_START_DATE) {
      return;
    }

    applyAllianceDuelPoints(
      result,
      rankings,
      pointRules,
      ALLIANCE_DUEL_START_DATE,
    );
    applyStateRulerPoints(result, stateRulerData, pointRules);
    applyEOSBonuses(result, pointRules, logs);

    return result;
  }, [
    members,
    rankings,
    stateRulerData,
    pointRules,
    search,
    logs,
    allianceSettings,
  ]);

  return {
    memberPoints,
    search,
    setSearch,
  };
}
