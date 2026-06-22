"use client";

import Rankings from "../../../features/Rankings/Rankings";
import { useApp } from "../../../hooks/useApp";

export default function RankingsPage() {
  const {
    members,
    weeks,
    stateRulerData,
    pointRules,
    loadMembers,
    loadLogs,
    logs,
  } = useApp();

  return (
    members &&
    weeks &&
    logs &&
    stateRulerData &&
    pointRules && (
      <Rankings
        members={members}
        weeks={weeks}
        stateRulerData={stateRulerData}
        pointRules={pointRules}
        loadMembers={loadMembers}
        loadLogs={loadLogs}
        logs={logs}
      />
    )
  );
}
