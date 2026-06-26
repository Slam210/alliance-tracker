"use client";

import Settings from "../../../features/Settings/Settings";
import { useApp } from "../../../hooks/useApp";

export default function SettingsPage() {
  const { allianceSettings, loadSettings } = useApp();

  if (!allianceSettings || !loadSettings) return null;
  return (
    <Settings
      allianceSettings={allianceSettings.settings}
      allianceInfo={allianceSettings.alliance}
      loadSettings={loadSettings}
    />
  );
}
