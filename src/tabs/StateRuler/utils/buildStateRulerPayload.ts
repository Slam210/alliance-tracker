import type { StateRulerWeek } from "../../../types/stateRuler";

type EntryType = "progress" | "clash" | "both";

export function buildStateRulerPayload(
  memberId: string,
  memberName: string,
  weekName: string,
  entryType: EntryType,
  row: StateRulerWeek["rows"][number],
) {
  return {
    memberId,
    memberName,
    weekName,
    entryType,

    progressRank:
      entryType === "progress" || entryType === "both"
        ? (row.progressRank ?? undefined)
        : undefined,

    progressScore:
      entryType === "progress" || entryType === "both"
        ? (row.progressScore ?? undefined)
        : undefined,

    clashRank:
      entryType === "clash" || entryType === "both"
        ? (row.clashRank ?? undefined)
        : undefined,

    clashScore:
      entryType === "clash" || entryType === "both"
        ? (row.clashScore ?? undefined)
        : undefined,
  };
}
