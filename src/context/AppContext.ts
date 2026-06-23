import { createContext } from "react";
import { PointRule } from "../types/derived/eos";
import { AdjustmentLog } from "../types/log";
import { Member } from "../types/member";
import { StateRulerResponse } from "../types/stateRuler";
import { Week } from "../types/week";

type AppContextType = {
  members: Member[];
  weeks: Week[];
  pointRules: PointRule[];
  logs: AdjustmentLog[];

  loadMembers: () => Promise<void>;
  loadWeeks: () => Promise<void>;
  loadPoints: () => Promise<void>;
  loadLogs: () => Promise<void>;
  loadAll: () => Promise<void>;

  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setWeeks: React.Dispatch<React.SetStateAction<Week[]>>;

  stateRulerData?: StateRulerResponse | undefined;
  loadStateRulerData: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
