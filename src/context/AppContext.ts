import { createContext } from "react";
import { PointRule } from "../types/derived/eos";
import { AdjustmentLog } from "../types/log";
import { Member } from "../types/member";
import { StateRulerResponse } from "../types/stateRuler";
import { Week } from "../types/week";
import { SettingsResponse } from "../types/settings";
import { Infraction } from "../types/derived/infractions";

type AppContextType = {
  members: Member[];
  weeks: Week[];
  pointRules: PointRule[];
  logs: AdjustmentLog[];
  allianceSettings?: SettingsResponse;

  loadMembers: () => Promise<void>;
  loadWeeks: () => Promise<void>;
  loadPoints: () => Promise<void>;
  loadLogs: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadAll: () => Promise<void>;

  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setWeeks: React.Dispatch<React.SetStateAction<Week[]>>;
  setInfractions: React.Dispatch<React.SetStateAction<Infraction[]>>;

  stateRulerData?: StateRulerResponse | undefined;
  loadStateRulerData: () => Promise<void>;

  infractions: Infraction[];
  loadInfractions: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
