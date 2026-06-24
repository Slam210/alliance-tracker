import { AllianceDuelSubmission, Week } from "../types/week";
import { apiJson } from "./client";

export function getAllAllianceDuelWeeks(): Promise<{
  weeks: Week[];
}> {
  return apiJson("/api/alliance-duel/weeks");
}

export function submitAllianceDuel(payload: AllianceDuelSubmission) {
  return apiJson("/api/alliance-duel/submit", "POST", payload);
}

export function submitAllianceDuelBatch(entries: AllianceDuelSubmission[]) {
  return apiJson("/api/alliance-duel/batch", "POST", entries);
}
