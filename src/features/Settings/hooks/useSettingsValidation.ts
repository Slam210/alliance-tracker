import { AllianceInfo, AllianceSettings } from "../../../types/settings";
import { formatDateOnly } from "../../../utils/date";

type Props = {
  allianceInfo: AllianceInfo;
  allianceSettings: AllianceSettings;

  name: string;
  tag: string;
  server: number;

  viewerPassword: string;
  adminPassword: string;

  startDate: string | null;

  scale: boolean;
  scaleDuration: number | null;

  startRequirements: (number | null)[];
  maxRequirements: (number | null)[];
};

export function useSettingsValidation({
  allianceInfo,
  allianceSettings,

  name,
  tag,
  server,

  viewerPassword,
  adminPassword,

  startDate,

  scale,
  scaleDuration,

  startRequirements,
  maxRequirements,
}: Props) {
  const hasAllianceNameChanged = name !== allianceInfo.name;

  const hasAllianceTagChanged = tag !== allianceInfo.tag;

  const hasAllianceServerChanged = server !== allianceInfo.server;

  const hasViewerPasswordChanged = viewerPassword !== "";
  const hasAdminPasswordChanged = adminPassword !== "";

  const hasDateChanged = startDate !== formatDateOnly(allianceSettings.start_date);

  const hasScalingChanged = scaleDuration !== allianceSettings.scale_duration;

  const minimumValid =
    startRequirements.length === 7 &&
    startRequirements.every((v) => Number(v) > 0);

  const endGameValid =
    !scale ||
    (maxRequirements.length === 7 &&
      maxRequirements.every((v) => Number(v) > 0));

  const hasMinimumChanged =
    JSON.stringify(startRequirements) !==
      JSON.stringify(allianceSettings.start_requirements) &&
    minimumValid &&
    endGameValid;

  const hasEndGameChanged =
    JSON.stringify(maxRequirements) !==
      JSON.stringify(allianceSettings.max_requirements) &&
    minimumValid &&
    endGameValid;

  const hasChanges =
    hasAllianceNameChanged ||
    hasAllianceTagChanged ||
    hasAllianceServerChanged ||
    hasViewerPasswordChanged ||
    hasAdminPasswordChanged ||
    hasDateChanged ||
    hasScalingChanged ||
    hasMinimumChanged ||
    hasEndGameChanged;

  const canSubmit = hasChanges;

  return {
    hasChanges,
    canSubmit,

    hasAllianceNameChanged,
    hasAllianceTagChanged,
    hasAllianceServerChanged,
    hasViewerPasswordChanged,
    hasAdminPasswordChanged,
    hasDateChanged,
    hasScalingChanged,
    hasMinimumChanged,
    hasEndGameChanged,
  };
}
