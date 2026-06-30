"use client";

import Settings from "../../../features/Settings/Settings";
import { useApp } from "../../../hooks/useApp";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export default function SettingsPage() {
  const { weeks, allianceSettings, loadSettings, pointRules, loadMembers,
    loadWeeks,
    loadStateRulerData,
    loadPoints,
    loadLogs, } = useApp();

  if (!allianceSettings || !loadSettings) return null;
  return (
    <ProtectedRoute>
      <Settings
        allianceSettings={allianceSettings.settings}
        allianceInfo={allianceSettings.alliance}
        loadSettings={loadSettings}
        pointRules={pointRules}
        loadPoints={loadPoints}
        loadMembers={loadMembers}
        loadWeeks={loadWeeks}
        loadStateRulerData={loadStateRulerData}
        loadLogs={loadLogs}
        weeks={weeks}
      />
    </ProtectedRoute>
  );
}
