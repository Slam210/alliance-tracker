import type {
  StateRulerEntryType,
  StateRulerWeek,
} from "../../../types/stateRuler";

export function buildStateRulerPayload(
  id: string,
  weekName: string,
  entryType: StateRulerEntryType,
  row: StateRulerWeek["rows"][number],
) {
  return {
    id,
    srWeek: Number(weekName.replace("SR", "")),
    type: entryType,

    progressRank:
      entryType === "progress" || entryType === "both"
        ? (row.progressRank ?? null)
        : null,

    progressScore:
      entryType === "progress" || entryType === "both"
        ? (row.progressScore ?? null)
        : null,

    clashRank:
      entryType === "clash" || entryType === "both"
        ? (row.clashRank ?? null)
        : null,

    clashScore:
      entryType === "clash" || entryType === "both"
        ? (row.clashScore ?? null)
        : null,
  };
}
