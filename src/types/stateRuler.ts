export type NullableNumber = number | null;

export type StateRulerResponse = Record<
  SRWeekName,
  {
    date: string | null;
    rows: StateRulerRow[];
  }
  >;

export type StateRulerEntryType = "progress" | "clash" | "both";

export type UpdateStateRulerParams = {
  allianceId: string | null;
  weekName: SRWeekName;
  date: string | null;
};

export type SubmitStateRulerParams = {
  id: string;
  srWeek: number;
  type: StateRulerEntryType;
  progressRank?: NullableNumber;
  progressScore?: NullableNumber;

  clashRank?: NullableNumber;
  clashScore?: NullableNumber;
  infractions?: StateRulerInfraction[];
};

export interface StateRulerWeek {
  name: SRWeekName;
  date: string | null;
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

export type StateRulerInfraction = {
  id: string;

  infraction: string | null;
  points: number | null;

  notes: string | null;
};
