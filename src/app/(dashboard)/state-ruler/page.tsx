"use client";

import StateRuler from "../../../features/StateRuler/StateRuler";
import { useApp } from "../../../hooks/useApp";

export default function StateRulerPage() {
  const { members, stateRulerData, loadMembers } = useApp();

  if (!members || !stateRulerData) return null;

  return (
    <StateRuler
      members={members}
      stateRulerData={stateRulerData}
      loadMembers={loadMembers}
    />
  );
}
