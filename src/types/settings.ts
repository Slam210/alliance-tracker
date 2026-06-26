export type RequirementMode = "unified" | "custom";

export interface SettingsResponse {
  alliance: AllianceInfo;
  settings: AllianceSettings;
}

export interface UpdateSettingsRequest {
  alliance: AllianceInfo;
  passwords: AlliancePasswords;
  settings: AllianceSettings;
}

export interface AllianceInfo {
  alliance_id: string;
  name: string;
  tag: string;
  server: number;
}

export interface AllianceSettingsPayload {
  start_date: string | null;

  minimum_mode: RequirementMode;
  start_requirements: (number | null)[];

  scale_duration: number | null;

  end_game_mode: RequirementMode;
  max_requirements: (number | null)[];
}

export interface AllianceSettings {
  start_date: string;

  minimum_mode: RequirementMode;
  start_requirements: (number | null)[];

  scale: boolean;
  scale_duration: number | null;

  end_game_mode: RequirementMode;
  max_requirements: (number | null)[];
}
export interface AlliancePasswords {
  viewer?: string;
  admin?: string;
}
