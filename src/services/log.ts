import { AddAdjustmentLogParams, AdjustmentLog } from "../types/log";
import { apiJson } from "./client";

export function getLogs() {
  return apiJson<AdjustmentLog[]>("/api/logs");
}

export function addAdjustmentLog(payload: AddAdjustmentLogParams) {
  return apiJson("/api/logs", "POST", payload);
}

export function deleteAdjustmentLog(logID: string) {
  return apiJson("/api/logs", "DELETE", {
    logID,
  });
}
