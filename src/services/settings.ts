import { apiJson, apiRequest } from "./client";
import { SettingsApiResponse, SettingsResponse } from "../types/settings";
import { parseDateOnly } from "../utils/date";

export async function getSettings(): Promise<SettingsResponse> {
  const response = await apiRequest<SettingsApiResponse>("/api/settings");

  return {
    ...response,
    settings: {
      ...response.settings,
      scale: false,
      start_date: parseDateOnly(response.settings.start_date),
    },
  };
}
export const updateSettings = (settings: Partial<SettingsResponse>) =>
  apiJson<SettingsResponse>("/api/settings", "PUT", settings);
