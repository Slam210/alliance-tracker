import { PointRule } from "../types/derived/eos";
import { apiJson } from "./client";

export function getPointRules(): Promise<PointRule[]> {
  return apiJson("/api/point-rules");
}
