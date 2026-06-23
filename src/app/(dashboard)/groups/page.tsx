"use client";

import Groups from "../../../features/Groups/Groups";
import { useApp } from "../../../hooks/useApp";

export default function GroupsPage() {
  const { members, loadMembers } = useApp();

  if (!members) return null;

  return <Groups members={members} loadMembers={loadMembers} />;
}
