import { Infraction, InfractionPayload } from "../types/derived/infractions";
import { apiJson } from "./client";

export function getInfractions() {
  return apiJson<Infraction[]>("/api/infractions");
}

export function updateInfraction(payload: InfractionPayload) {
  return apiJson<Infraction>("/api/infractions", "POST", payload);
}

export function deleteInfraction() {
  return apiJson<void>("/api/infractions", "DELETE");
}
