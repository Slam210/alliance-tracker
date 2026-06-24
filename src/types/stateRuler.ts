export type NullableNumber = number | null;

export type StateRulerResponse = Record<SRWeekName, StateRulerRow[]>;

export type StateRulerEntryType = "progress" | "clash" | "both";

export type SubmitStateRulerParams = {
  id: string;
  srWeek: number;
  type: StateRulerEntryType;
  progressRank?: NullableNumber;
  progressScore?: NullableNumber;

  clashRank: NullableNumber;
  clashScore: NullableNumber;
};

export interface StateRulerWeek {
  name: SRWeekName;
  rows: StateRulerRow[];
}

export interface StateRulerRow {
  id: string;

  progressRank: NullableNumber;
  progressScore: NullableNumber;

  clashRank: NullableNumber;
  clashScore: NullableNumber;
}

export type SRWeekName = `SR${number}` | string;

export type StateRulerSubmitType = "PROGRESS" | "CLASH" | "BOTH";
