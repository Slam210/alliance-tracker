import {
  StateRulerResponse,
  SubmitStateRulerParams,
  UpdateStateRulerParams,
} from "../types/stateRuler";
import { apiJson } from "./client";

export function getAllStateRulers(): Promise<{
  data: StateRulerResponse;
}> {
  return apiJson("/api/state-ruler");
}

export function updateStateRulerDate({ allianceId, weekName, date }: UpdateStateRulerParams) {
  return apiJson("/api/state-ruler/date", "POST", { allianceId, weekName, date });
}

export function submitStateRuler(payload: SubmitStateRulerParams) {
  return apiJson("/api/state-ruler/submit", "POST", payload);
}

export function deleteStateRuler({ weekId, memberId }: { weekId?: number; memberId?: string }) {
  return apiJson("/api/state-ruler/delete", "DELETE", { weekId, memberId });
}
