import { useState } from "react";
import { AllianceSettings, RequirementMode } from "../../../types/settings";
import { formatDateOnly } from "../../../utils/date";

export function useSettingsForm(allianceSettings: AllianceSettings) {
  const [startDate, setStartDate] = useState(
    allianceSettings.start_date
      ? formatDateOnly(allianceSettings.start_date)
      : ""
  );

  const [minimumMode, setMinimumMode] = useState<RequirementMode>(
    allianceSettings.minimum_mode ?? "unified",
  );

  const [endGameMode, setEndGameMode] = useState<RequirementMode>(
    allianceSettings.end_game_mode ?? "unified",
  );

  const [startRequirements, setStartRequirements] = useState<(number | null)[]>(
    allianceSettings.start_requirements?.length
      ? allianceSettings.start_requirements
      : Array(7).fill(null),
  );

  const [maxRequirements, setMaxRequirements] = useState<(number | null)[]>(
    allianceSettings.max_requirements?.length
      ? allianceSettings.max_requirements
      : Array(7).fill(null),
  );

  const [scale, setScale] = useState<boolean>(
    allianceSettings.scale_duration === null ? false : true,
  );

  const [scaleDuration, setScaleDuration] = useState<number | null>(
    allianceSettings.scale_duration ?? null,
  );

  const updateValue = (
    index: number,
    value: number | null,
    setter: React.Dispatch<React.SetStateAction<(number | null)[]>>,
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  return {
    startDate,
    setStartDate,

    minimumMode,
    setMinimumMode,

    endGameMode,
    setEndGameMode,

    startRequirements,
    setStartRequirements,

    maxRequirements,
    setMaxRequirements,

    scale,
    setScale,

    scaleDuration,
    setScaleDuration,

    updateValue,
  };
}
