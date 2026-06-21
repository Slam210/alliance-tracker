import type {
  MemberWithPoints,
  PointRule,
} from "../../../../types/derived/eos";
import type { StateRulerResponse } from "../../../../types/stateRuler";
import { addStateRulerLog } from "../log";
import { getStateRulerRulePoints } from "./pointRules";

export function applyStateRulerPoints(
  members: Record<string, MemberWithPoints>,
  stateRulerData: StateRulerResponse,
  pointRules: PointRule[],
) {
  Object.entries(stateRulerData).forEach(([weekName, rows]) => {
    rows.forEach((row) => {
      const member = members[row.id];
      if (!member) return;

      // PROGRESS
      if (row.progressRank != null && row.progressScore != null) {
        const points = getStateRulerRulePoints(pointRules, "progress");
        addStateRulerLog(
          member,
          weekName,
          "progress",
          points,
          row.progressRank,
          row.progressScore,
        );
      }

      // CLASH
      if (row.clashRank != null && row.clashScore != null) {
        const points = getStateRulerRulePoints(pointRules, "clash");
        addStateRulerLog(
          member,
          weekName,
          "clash",
          points,
          row.clashRank,
          row.clashScore,
        );
      }
    });
  });
}
