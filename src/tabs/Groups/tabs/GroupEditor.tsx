import { useMemo, useState } from "react";

import type { Member } from "../../../types/member";

import SearchMember from "../../../components/SearchMember";

import GroupFilters from "../components/GroupFilters";
import GroupEditorActions from "../components/GroupEditorActions";
import GroupEditorCard from "../components/GroupEditorCard";
import AvailableMembers from "../components/AvailableMembers";

import { useFilteredMembers } from "../hooks/useFilteredMembers";
import { useGroupFilters } from "../hooks/useGroupedFilters";
import { useGroupOptions } from "../hooks/useGroupOptions";
import { useGroupActions } from "../hooks/useGroupActions";
import { useGroupEditor } from "../hooks/useGroupEditor";
import { useAutoScrollDrag } from "../hooks/useAutoScrollDrag";

import { getEffectiveOffset } from "../utils/Offset";

type Props = {
  members: Member[];
  loadMembers: () => void;
};

export default function GroupEditor({ members, loadMembers }: Props) {
  const {
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
    setDisplayNameFilter,
    setTimezoneFilter,
    clearFilters,
    setOffsetFilter,
  } = useGroupFilters();

  const [nameSearch, setNameSearch] = useState("");

  const {
    groups,
    setGroups,
    localMembers,
    setLocalMembers,
    activeMembers,
    handleDrop,
    setLeader,
    createGroup,
    deleteGroup,
    removeMember,
  } = useGroupEditor(members);

  const { isAssigning, handleAssignGroup } = useGroupActions({
    loadMembers,
  });

  useAutoScrollDrag();

  const filteredMembers = useFilteredMembers(
    activeMembers,
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
  );

  const searchedMembers = useMemo(() => {
    if (!nameSearch.trim()) {
      return filteredMembers;
    }

    const query = nameSearch.toLowerCase();

    return filteredMembers.filter((member) =>
      String(member.nickname || member.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [filteredMembers, nameSearch]);

  const { displayNames, timezones, offsets } = useGroupOptions(activeMembers);

  const utcGroups = useMemo(() => {
    const offsets = activeMembers
      .map((member) => getEffectiveOffset(member.displayName))
      .filter((offset): offset is number => offset !== undefined);

    return Array.from(new Set(offsets)).sort((a, b) => a - b);
  }, [activeMembers]);

  const ungroupedMembers = searchedMembers.filter(
    (member) => member.groupNumber === "",
  );

  const handleSetGroups = async () => {
    await handleAssignGroup(members, localMembers);
  };

  const handleResetGroups = () => {
    setLocalMembers(members);
  };

  return (
    <div className="space-y-8 p-3 md:p-6 text-xs sm:text-sm lg:text-base xl:text-lg">
      <GroupFilters
        displayNameFilter={displayNameFilter}
        timezoneFilter={timezoneFilter}
        displayNames={displayNames}
        timezones={timezones}
        setDisplayNameFilter={setDisplayNameFilter}
        setTimezoneFilter={setTimezoneFilter}
        clearFilters={clearFilters}
        offsetFilter={offsetFilter}
        setOffsetFilter={setOffsetFilter}
        offsets={offsets}
      />

      <SearchMember search={nameSearch} setSearch={setNameSearch} />

      <GroupEditorActions
        createGroup={createGroup}
        handleSetGroups={handleSetGroups}
        handleResetGroups={handleResetGroups}
        isAssigning={isAssigning}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <GroupEditorCard
            key={group.groupNumber}
            group={group}
            activeMembers={activeMembers}
            nameSearch={nameSearch}
            utcGroups={utcGroups}
            setGroups={setGroups}
            setLocalMembers={setLocalMembers}
            handleDrop={handleDrop}
            setLeader={setLeader}
            deleteGroup={deleteGroup}
            removeMember={removeMember}
          />
        ))}
      </div>

      <AvailableMembers
        members={ungroupedMembers}
        nameSearch={nameSearch}
        utcGroups={utcGroups}
        handleDrop={handleDrop}
      />
    </div>
  );
}
