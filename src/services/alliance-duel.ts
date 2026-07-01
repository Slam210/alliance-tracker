import { AllianceDuelSubmission, AllianceUpdateSubmission, ApiWeek } from "../types/week";
import { apiJson } from "./client";

export function getAllAllianceDuelWeeks(): Promise<{
  weeks: ApiWeek[];
}> {
  return apiJson("/api/alliance-duel/weeks");
}

export function submitAllianceDuel(payload: AllianceDuelSubmission) {
  return apiJson("/api/alliance-duel/submit", "POST", payload);
}

export function updateAllianceDuel(payload: AllianceUpdateSubmission) {
  return apiJson("/api/alliance-duel/update", "POST", payload);
}

export function submitAllianceDuelBatch(entries: AllianceDuelSubmission[]) {
  return apiJson("/api/alliance-duel/batch", "POST", entries);
}

export function deleteAllianceDuel(payload?: { weekNumber?: number; event?: string; memberId?: string }) {
  return apiJson("/api/alliance-duel/delete", "DELETE", payload);
}
