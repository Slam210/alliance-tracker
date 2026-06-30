import { PointRuleUpdatePayload } from "../features/Settings/hooks/usePointRules";
import { PointRule } from "../types/derived/eos";
import { apiJson } from "./client";

export function getPointRules(): Promise<PointRule[]> {
  return apiJson("/api/point-rules");
}

export function updatePointRules(payload: PointRuleUpdatePayload) {
  return apiJson("/api/point-rules", "POST", payload);
}

export function deletePointRules() {
  return apiJson("/api/point-rules", "DELETE");
}
