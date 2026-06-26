"use client";

import Rankings from "../../../features/Rankings/Rankings";
import { useApp } from "../../../hooks/useApp";

export default function RankingsPage() {
  const {
    members,
    weeks,
    stateRulerData,
    pointRules,
    logs,
    allianceSettings,
    loadMembers,
    loadLogs,
  } = useApp();

  if(!members || !weeks || !logs || !stateRulerData || !pointRules || !allianceSettings){
    return;
  }

  return (
      <Rankings
        members={members}
        weeks={weeks}
        stateRulerData={stateRulerData}
        pointRules={pointRules}
        loadMembers={loadMembers}
        loadLogs={loadLogs}
        allianceSettings={allianceSettings.settings}
        logs={logs}
      />
  );
}
