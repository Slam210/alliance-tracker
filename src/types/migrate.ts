import { PointRule } from "./derived/eos";
import { AdjustmentLog } from "./log";
import { Member, MemberStatus } from "./member";
import { StateRulerRow } from "./stateRuler";
import { Week } from "./week";

export type StateRulerMigrateRow = StateRulerRow & {
  name: string;
};

export interface MemberMigrate {
  id: string;
  name: string;
  nickname?: string;
  status: MemberStatus;
  joined_date: string;
  reason?: string;
  timezone?: string;
  display_name?: string;
  group_number: number | "" | null;
  group_leader: boolean;
  eos_reward: string;
}

export interface ExportData {
  members: Member[];
  weeks: Week[];
  stateRulers: Record<string, StateRulerMigrateRow[]>;
  pointRules: PointRule[];
  adjustmentLogs: AdjustmentLog[];
}
