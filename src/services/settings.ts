import { apiJson, apiRequest } from "./client";
import { SettingsResponse } from "../types/settings";

export const getSettings = () => apiRequest<SettingsResponse>("/api/settings");

export const updateSettings = (settings: Partial<SettingsResponse>) =>
  apiJson<SettingsResponse>("/api/settings", "PUT", settings);
