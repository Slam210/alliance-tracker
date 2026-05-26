import { useMemo } from "react";
import type { Week } from "../../../types/week";
import type { Member } from "../../../types/member";
import {
  buildActiveMemberSet,
  computeAllTimeRankings,
  computeAllTimeInsights,
} from "../utils/allTimeCalculations";

export function useAllTimeInsights(members: Member[], weeks: Week[]) {
  const activeMemberIds = useMemo(
    () => buildActiveMemberSet(members),
    [members],
  );

  const allTimeRankings = useMemo(
    () => computeAllTimeRankings(weeks, activeMemberIds),
    [weeks, activeMemberIds],
  );

  const allTimeInsights = useMemo(
    () => computeAllTimeInsights(weeks, activeMemberIds),
    [weeks, activeMemberIds],
  );

  return {
    activeMemberIds,
    allTimeRankings,
    allTimeInsights,
  };
}
