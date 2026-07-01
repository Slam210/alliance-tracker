"use client";

import ManageMembers from "../../../features/ManageMembers/ManageMembers";
import { useApp } from "../../../hooks/useApp";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export default function MembersPage() {
  const { members, loadMembers } = useApp();

  return (
    <ProtectedRoute>
      <ManageMembers members={members} loadMembers={loadMembers} />
    </ProtectedRoute>
  );
}
