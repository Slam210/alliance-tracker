"use client";

import MembersRequired from "../../../components/required/MembersRequired";
import Groups from "../../../features/Groups/Groups";
import { useApp } from "../../../hooks/useApp";

export default function GroupsPage() {
  const { members, loadMembers } = useApp();

  if (!members) return null;

  return <MembersRequired members={members}>
    <Groups members={members} loadMembers={loadMembers} />
  </MembersRequired>;
}
