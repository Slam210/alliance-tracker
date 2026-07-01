import type { Member } from "../../../types/member";
import type {
  StateRulerResponse,
  StateRulerWeek,
} from "../../../types/stateRuler";

export function buildInitialWeeks(
  stateRulerData: StateRulerResponse,
  activeMembers: Member[],
): StateRulerWeek[] {
  const existingWeeks: StateRulerWeek[] = Object.entries(stateRulerData)
    .map(([name, week]) => ({
      name,
      date: week.date,
      rows: activeMembers.map((member) => {
        const existing = week.rows.find((r) => r.id === member.id);

        return (
          existing ?? {
            id: member.id,
            progressRank: null,
            progressScore: null,
            clashRank: null,
            clashScore: null,
          }
        );
      }),
    }))
    .filter((week) => {
      const num = Number(week.name.replace("SR", ""));
      return num >= 1;
    })
    .sort(
      (a, b) =>
        Number(a.name.replace("SR", "")) -
        Number(b.name.replace("SR", "")),
    );

  const highestWeek =
    existingWeeks.length > 0
      ? Math.max(
          ...existingWeeks.map((week) =>
            Number(week.name.replace("SR", "")),
          ),
        )
      : 0;

  const nextWeek: StateRulerWeek = {
    name: `SR${highestWeek + 1}`,
    date: null,
    rows: activeMembers.map((member) => ({
      id: member.id,
      progressRank: null,
      progressScore: null,
      clashRank: null,
      clashScore: null,
    })),
  };

  return [...existingWeeks, nextWeek];
}
