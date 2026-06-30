import { ChangedInfraction } from "../features/StateRuler/utils/buildStateRulerPayload";
import { StateRulerInfraction } from "./derived/infractions";

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
  infractions?: ChangedInfraction[];
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

  infractions: StateRulerInfraction[];
}

export type SRWeekName = `SR${number}` | string;

export type StateRulerSubmitType = "PROGRESS" | "CLASH" | "BOTH";

export type StateRulerInfractionViewRow = {
  state_ruler_id: string;
  member_id: string;
  infraction_type_id: string;
  infraction: string | null;
  points: number;
  notes: string | null;
};

export type StateRulerInfractionUI = {
  id: string;
  infraction: string | null;
  points: number;
  notes: string | null;
};
