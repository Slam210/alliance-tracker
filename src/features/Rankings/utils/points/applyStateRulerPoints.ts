import type {
  MemberWithPoints,
  PointRule,
} from "../../../../types/derived/eos";
import type { StateRulerResponse } from "../../../../types/stateRuler";
import { addStateRulerInfractionLog, addStateRulerLog, addStateRulerParticipationLog } from "../log";
import { getStateRulerRulePoints } from "./pointRules";

export function applyStateRulerPoints(
  members: Record<string, MemberWithPoints>,
  stateRulerData: StateRulerResponse | undefined,
  pointRules: PointRule[],
) {
  if (!stateRulerData) {
    return;
  }

  Object.entries(stateRulerData).forEach(([weekName, week]) => {
    // Participation - every eligible member
    if (week.date) {
      const participationPoints = getStateRulerRulePoints(
        pointRules,
        "participation",
      );

      const weekDate = new Date(week.date);

      Object.values(members).forEach((member) => {
        if (
          member.joined_date &&
          new Date(member.joined_date) <= weekDate
        ) {
          addStateRulerParticipationLog(
            member,
            weekName,
            participationPoints,
          );
        }
      });
    }

    // Progress / Clash - only members with entries
    week.rows.forEach((row) => {
      const member = members[row.id];
      if (!member) return;

      if (row.progressRank != null && row.progressScore != null) {
        const points = getStateRulerRulePoints(
          pointRules,
          "progress",
          row.progressRank,
        );

        addStateRulerLog(
          member,
          weekName,
          "progress",
          points,
          row.progressRank,
          row.progressScore,
        );
      }

      if (row.clashRank != null && row.clashScore != null) {
        const points = getStateRulerRulePoints(
          pointRules,
          "clash",
          row.clashRank,
        );

        addStateRulerLog(
          member,
          weekName,
          "clash",
          points,
          row.clashRank,
          row.clashScore,
        );
      }

      row.infractions?.forEach((infraction) => {
        addStateRulerInfractionLog(
          member,
          weekName,
          infraction.infraction,
          infraction.points,
          infraction.notes,
        );
      });
    });
  });
}
