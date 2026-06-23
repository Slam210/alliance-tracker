export type NullableNumber = number | null;

export type StateRulerResponse = Record<SRWeekName, StateRulerRow[]>;

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

  lastUpdated: string | null;
}

export type SRWeekName = `SR${number}` | string;

export type StateRulerSubmitType = "PROGRESS" | "CLASH" | "BOTH";
