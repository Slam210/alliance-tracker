import { useState } from "react";
import type { adjustmentType } from "../../../types/log";

export function useAdjustmentForm() {
  const [adjustmentType, setAdjustmentType] = useState<adjustmentType>("bonus");

  const [count, setCount] = useState(1);

  const [points, setPoints] = useState(10);

  const [reason, setReason] = useState("");

  const total = count * points;

  return {
    adjustmentType,
    setAdjustmentType,
    count,
    setCount,
    points,
    setPoints,
    reason,
    setReason,
    total,
  };
}
