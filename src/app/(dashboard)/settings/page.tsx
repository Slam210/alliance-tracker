"use client";

import Settings from "../../../features/Settings/Settings";
import { useApp } from "../../../hooks/useApp";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export default function SettingsPage() {
  const { allianceSettings, loadSettings, pointRules, loadPoints } = useApp();

  if (!allianceSettings || !loadSettings) return null;
  return (
    <ProtectedRoute>
      <Settings
        allianceSettings={allianceSettings.settings}
        allianceInfo={allianceSettings.alliance}
        loadSettings={loadSettings}
        pointRules={pointRules}
        loadPoints={loadPoints}
      />
    </ProtectedRoute>
  );
}
