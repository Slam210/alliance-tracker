import { useState } from "react";
import { AllianceSettings, RequirementMode } from "../../../types/settings";

export function useSettingsForm(allianceSettings: AllianceSettings) {
  const [startDate, setStartDate] = useState(allianceSettings.start_date ?? "");

  const [minimumMode, setMinimumMode] = useState<RequirementMode>(
    allianceSettings.minimum_mode ?? "unified",
  );

  const [endGameMode, setEndGameMode] = useState<RequirementMode>(
    allianceSettings.end_game_mode ?? "unified",
  );

  const [startRequirements, setStartRequirements] = useState<(number | "")[]>(
    allianceSettings.start_requirements?.length
      ? allianceSettings.start_requirements
      : Array(7).fill(""),
  );

  const [maxRequirements, setMaxRequirements] = useState<(number | "")[]>(
    allianceSettings.max_requirements?.length
      ? allianceSettings.max_requirements
      : Array(7).fill(""),
  );

  const [scale, setScale] = useState<boolean>(false);

  const [scaleDuration, setScaleDuration] = useState<number>(
    allianceSettings.scale_duration ?? 0,
  );

  const updateValue = (
    index: number,
    value: number | "",
    setter: React.Dispatch<React.SetStateAction<(number | "")[]>>,
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
