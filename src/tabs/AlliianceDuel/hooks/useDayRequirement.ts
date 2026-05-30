import { useMemo } from "react";

import type { Week } from "../../../types/week";
import { getDayKey } from "../utils/getDayKey";
import { getWeekSheetName } from "../utils/getWeekSheetName";
import { getRequirement } from "../../Rankings/utils/scoring";

type Params = {
  selectedDate: Date | null;
  weeks: Week[];
};

export function useAllianceDuelContext({ selectedDate }: Params) {
  const dayKey = useMemo(() => {
    if (!selectedDate) return null;
    return getDayKey(selectedDate);
  }, [selectedDate]);

  const weekName = useMemo(() => {
    if (!selectedDate) return null;
    return getWeekSheetName(selectedDate);
  }, [selectedDate]);

  const requirement = useMemo(() => {
    if (!dayKey) return null;

    return getRequirement(dayKey, weekName ?? undefined);
  }, [dayKey, weekName]);

  return {
    requirement,
  };
}
