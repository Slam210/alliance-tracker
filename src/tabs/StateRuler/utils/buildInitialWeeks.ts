// utils/buildInitialWeeks.ts

import type { Member } from "../../../types/member";
import type {
  StateRulerResponse,
  StateRulerWeek,
} from "../../../types/stateRuler";

export function buildInitialWeeks(
  stateRulerData: StateRulerResponse,
  activeMembers: Member[],
): StateRulerWeek[] {
  const existingWeeks = Object.entries(stateRulerData)
    .map(([name, rows]) => ({
      name,
      rows: activeMembers.map((member) => {
        const existing = rows.find((r) => r.id === member.id);

        return (
          existing ?? {
            id: member.id,
            name: member.name,
            progressRank: null,
            progressScore: null,
            clashRank: null,
            clashScore: null,
            lastUpdated: null,
          }
        );
      }),
    }))
    .filter((week) => {
      const num = Number(week.name.replace("SR", ""));
      return num >= 3;
    })
    .sort(
      (a, b) =>
        Number(a.name.replace("SR", "")) - Number(b.name.replace("SR", "")),
    );

  const highestWeek =
    existingWeeks.length > 0
      ? Math.max(
          ...existingWeeks.map((week) => Number(week.name.replace("SR", ""))),
        )
      : 2;

  const nextWeek: StateRulerWeek = {
    name: `SR${highestWeek + 1}`,
    rows: activeMembers.map((member) => ({
      id: member.id,
      name: member.name,
      progressRank: null,
      progressScore: null,
      clashRank: null,
      clashScore: null,
      lastUpdated: null,
    })),
  };

  return [...existingWeeks, nextWeek];
}
