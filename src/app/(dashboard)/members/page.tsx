"use client";

import ManageMembers from "../../../features/ManageMembers/ManageMembers";
import { useApp } from "../../../hooks/useApp";

export default function MembersPage() {
  const { members, loadMembers } = useApp();

  return (
    <div>
      <ManageMembers members={members} loadMembers={loadMembers} />
    </div>
  );
}
