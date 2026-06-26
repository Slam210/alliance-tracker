import {
  StateRulerResponse,
  SubmitStateRulerParams,
} from "../types/stateRuler";
import { apiJson } from "./client";

export function getAllStateRulers(): Promise<{
  data: StateRulerResponse;
}> {
  return apiJson("/api/state-ruler");
}
export function submitStateRuler(payload: SubmitStateRulerParams) {
  return apiJson("/api/state-ruler/submit", "POST", payload);
}
