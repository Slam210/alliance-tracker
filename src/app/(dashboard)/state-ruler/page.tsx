"use client";

import StateRuler from "../../../features/StateRuler/StateRuler";
import { useApp } from "../../../hooks/useApp";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import MembersRequired from "../../../components/required/MembersRequired";

export default function StateRulerPage() {
  const { members, stateRulerData, loadMembers } = useApp();

  if (!members || !stateRulerData) return null;

  return (
    <ProtectedRoute>
      <MembersRequired members={members}>
        <StateRuler
          members={members}
          stateRulerData={stateRulerData}
          loadMembers={loadMembers}
        />
      </MembersRequired>
    </ProtectedRoute>
  );
}
