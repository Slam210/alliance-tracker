"use client";

import { ProtectedRoute } from "../../../components/ProtectedRoute";
import MembersRequired from "../../../components/required/MembersRequired";
import SettingsRequired from "../../../components/required/SettingsRequired";
import AllianceDuel from "../../../features/AlliianceDuel/AllianceDuel";
import { useApp } from "../../../hooks/useApp";

export default function AllianceDuelPage() {
  const { members, weeks, loadWeeks, allianceSettings } = useApp();

  if (!members|| !allianceSettings) return null;

  return (
    <ProtectedRoute>
      <MembersRequired members={members.filter((member) => member.status === "Active")}>
        <SettingsRequired
          requirements={allianceSettings.settings.start_requirements}
        >
          <AllianceDuel
            members={members}
            weeks={weeks}
            loadWeeks={loadWeeks}
            allianceSettings={allianceSettings.settings}
          />
        </SettingsRequired>
      </MembersRequired>
    </ProtectedRoute>
  );
}
