import { useMemo } from "react";

import { getWeekSheetName } from "../utils/getWeekSheetName";
import { getRequirement } from "../../Rankings/utils/scoring";
import { getEventKey } from "../../../constants/week";

type Params = {
  selectedDate: Date | null;
  START_BY_DAY: (number | null)[];
  END_BY_DAY: (number | null)[];
  TOTAL_WEEKS: number | null;
  startDate: Date;
};

export function useAllianceDuelContext({
  selectedDate,
  START_BY_DAY,
  END_BY_DAY,
  TOTAL_WEEKS,
  startDate
}: Params) {
  const eventKey = useMemo(() => {
    if (!selectedDate) return null;
    return getEventKey(selectedDate, startDate);
  }, [selectedDate, startDate]);

  const weekName = useMemo(() => {
    if (!selectedDate) return null;
    return getWeekSheetName(selectedDate, startDate);
  }, [selectedDate, startDate]);

  /**
   * CONFIG VALIDATION
   * - start must be fully filled
   * - if scaling enabled (TOTAL_WEEKS not null), end must also be filled
   */
  const isConfigured = useMemo(() => {
    const startValid = START_BY_DAY.every((v) => v !== null);

    const endValid =
      TOTAL_WEEKS === null || END_BY_DAY.every((v) => v !== null);

    return startValid && endValid;
  }, [START_BY_DAY, END_BY_DAY, TOTAL_WEEKS]);

  const requirement = useMemo(() => {
    if (!eventKey || !isConfigured) return null;

    return getRequirement(
      eventKey,
      START_BY_DAY,
      END_BY_DAY,
      TOTAL_WEEKS,
      weekName ?? undefined,
    );
  }, [eventKey, weekName, START_BY_DAY, END_BY_DAY, TOTAL_WEEKS, isConfigured]);

  return {
    requirement,
    isConfigured,
  };
}
