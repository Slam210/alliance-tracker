"use client";

import StateRuler from "../../../features/StateRuler/StateRuler";
import { useApp } from "../../../hooks/useApp";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import MembersRequired from "../../../components/required/MembersRequired";
import SettingsRequired from "../../../components/required/SettingsRequired";

export default function StateRulerPage() {
  const { members, stateRulerData, allianceSettings, loadMembers, loadStateRulerData, infractions } = useApp();

  if (!members || !stateRulerData || !allianceSettings) return null;

  return (
    <ProtectedRoute>
      <MembersRequired members={members}>
        <SettingsRequired settings={allianceSettings.settings}>
          <StateRuler
            members={members}
            stateRulerData={stateRulerData}
            loadMembers={loadMembers}
            loadStateRulerData={loadStateRulerData}
            startDate={allianceSettings.settings.start_date}
            infractions={infractions}
          />
        </SettingsRequired>
      </MembersRequired>
    </ProtectedRoute>
  );
}
