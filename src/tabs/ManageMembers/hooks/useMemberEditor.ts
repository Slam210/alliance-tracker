import { useState } from "react";
import type { Member } from "../../../types/member";

export function useMemberEditor(
  onRenameMember: (
    id: string,
    name?: string,
    nickname?: string,
  ) => Promise<void>,
) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");

  function handleSelect(member: Member) {
    setSelectedMember(member);
    setNewName(member.name);
    setNewNickname(member.nickname || "");
  }

  function clearSelection() {
    setSelectedMember(null);
    setNewName("");
    setNewNickname("");
  }

  async function handleRenameSubmit() {
    if (!selectedMember) return;

    await onRenameMember(selectedMember.id, newName.trim(), newNickname.trim());

    clearSelection();
  }

  return {
    selectedMember,
    newName,
    newNickname,
    setNewName,
    setNewNickname,
    handleSelect,
    handleRenameSubmit,
    clearSelection,
  };
}
