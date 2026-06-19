import { useState } from "react";
import type { Member } from "../../../types/member";

export function useMemberEditor(
  onRenameMember: (
    id: string,
    name?: string,
    nickname?: string,
    timezone?: string,
    displayName?: string,
  ) => Promise<void>,
) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  function handleSelect(member: Member) {
    setSelectedMember(member);
    setNewName(member.name);
    setNewNickname(member.nickname || "");
    setTimezone(member.timezone || "");
    setDisplayName(member.displayName || "");
  }

  function clearSelection() {
    setSelectedMember(null);
    setNewName("");
    setNewNickname("");
    setTimezone("");
    setDisplayName("");
  }

  async function handleRenameSubmit() {
    if (!selectedMember) return;

    await onRenameMember(
      selectedMember.id,
      newName.trim(),
      newNickname.trim(),
      timezone.trim(),
      displayName.trim(),
    );

    clearSelection();
  }

  return {
    selectedMember,
    newName,
    newNickname,
    timezone,
    displayName,
    nameSearch,
    setNewName,
    setNewNickname,
    setTimezone,
    setDisplayName,
    handleSelect,
    handleRenameSubmit,
    clearSelection,
    setNameSearch,
  };
}
