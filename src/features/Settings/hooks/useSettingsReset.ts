import {
  AllianceInfo,
  AllianceSettings,
  RequirementMode,
} from "../../../types/settings";
import { formatDateOnly } from "../../../utils/date";

type Props = {
  allianceInfo: AllianceInfo;
  allianceSettings: AllianceSettings;

  setName: (v: string) => void;
  setTag: (v: string) => void;
  setServer: (v: number) => void;

  setViewerPassword: (v: string) => void;
  setAdminPassword: (v: string) => void;

  setStartDate: (v: string) => void;

  setScale: (v: boolean) => void;
  setScaleDuration: (v: number | null) => void;

  setMinimumMode: (v: RequirementMode) => void;
  setEndGameMode: (v: RequirementMode) => void;

  setStartRequirements: (v: number[]) => void;
  setMaxRequirements: (v: number[]) => void;
};

export function useSettingsReset({
  allianceInfo,
  allianceSettings,

  setName,
  setTag,
  setServer,

  setViewerPassword,
  setAdminPassword,

  setStartDate,

  setScale,
  setScaleDuration,

  setMinimumMode,
  setEndGameMode,

  setStartRequirements,
  setMaxRequirements,
}: Props) {
  return () => {
    setName(allianceInfo.name);
    setTag(allianceInfo.tag);
    setServer(allianceInfo.server);

    setViewerPassword("");
    setAdminPassword("");

    setStartDate(allianceSettings.start_date
      ? formatDateOnly(allianceSettings.start_date)
      : "");

    setScale(allianceSettings.scale_duration === null ? false : true);
    setScaleDuration(allianceSettings.scale_duration ?? null);

    setMinimumMode(allianceSettings.minimum_mode);
    setEndGameMode(allianceSettings.end_game_mode);

    setStartRequirements(
      allianceSettings.start_requirements?.length
        ? allianceSettings.start_requirements
        : Array(7).fill(null),
    );

    setMaxRequirements(
      allianceSettings.max_requirements?.length
        ? allianceSettings.max_requirements
        : Array(7).fill(null),
    );
  };
}
