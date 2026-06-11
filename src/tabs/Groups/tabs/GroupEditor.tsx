import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import GroupFilters from "../components/GroupFilters";
import MemberCard from "../components/MemberCard";
import { useFilteredMembers } from "../hooks/useFilteredMembers";
import { useGroupFilters } from "../hooks/useGroupedFilters";
import { useGroupOptions } from "../hooks/useGroupOptions";
import { useGroupActions } from "../hooks/useGroupActions";
import SubmitText from "../../../components/SubmitText";

type Props = {
  members: Member[];
};

export default function GroupEditor({ members }: Props) {
  const {
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
    setDisplayNameFilter,
    setTimezoneFilter,
    clearFilters,
    setOffsetFilter,
  } = useGroupFilters();

  const [localMembers, setLocalMembers] = useState<Member[]>(members);
  const [nameSearch, setNameSearch] = useState("");
  const { isAssigning, handleAssignGroup } = useGroupActions();

  const activeMembers = localMembers.filter((m) => m.status === "Active");

  const filteredMembers = useFilteredMembers(
    activeMembers,
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
  );

  const searchedMembers = useMemo(() => {
    if (!nameSearch.trim()) return filteredMembers;

    const query = nameSearch.toLowerCase();

    return filteredMembers.filter((m) =>
      (m.nickname || m.name || "").toLowerCase().includes(query),
    );
  }, [filteredMembers, nameSearch]);

  const { displayNames, timezones, offsets } = useGroupOptions(activeMembers);

  const [groups, setGroups] = useState<string[]>(() => {
    const existing = activeMembers
      .map((m) => m.groupNumber)
      .filter((g): g is string => g !== "");

    return Array.from(new Set(existing))
      .map(Number)
      .sort((a, b) => a - b)
      .map(String);
  });

  const handleDrop = (memberId: string, groupNumber: string | "") => {
    if (groupNumber !== "") {
      setGroups((prev) =>
        prev.includes(groupNumber) ? prev : [...prev, groupNumber],
      );
    }

    setLocalMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              groupNumber,
              ...(groupNumber === "" ? { groupLeader: false } : {}),
            }
          : member,
      ),
    );
  };

  const setLeader = (memberId: string, groupNumber: string) => {
    setLocalMembers((prev) =>
      prev.map((member) =>
        member.groupNumber === groupNumber
          ? {
              ...member,
              groupLeader: member.id === memberId,
            }
          : member,
      ),
    );
  };

  const createGroup = () => {
    setGroups((prev) => {
      const max = prev.length ? Math.max(...prev.map(Number)) : 0;
      const next = String(max + 1);

      if (prev.includes(next)) return prev;

      return [...prev, next];
    });
  };

  const handleSetGroups = async () => {
    await handleAssignGroup(members, localMembers);
  };

  // const handleResetGroups = () => {
  //   setLocalMembers(members);

  //   const existing = members
  //     .map((m) => m.groupNumber)
  //     .filter((g): g is string => g !== "");

  //   setGroups(
  //     Array.from(new Set(existing))
  //       .map(Number)
  //       .sort((a, b) => a - b)
  //       .map(String),
  //   );
  // };

  const deleteGroup = (groupKey: string) => {
    setGroups((prev) => prev.filter((g) => g !== groupKey));
    setLocalMembers((prev) =>
      prev.map((m) =>
        m.groupNumber === groupKey
          ? { ...m, groupNumber: "", groupLeader: false }
          : m,
      ),
    );
  };

  const ungroupedMembers = searchedMembers.filter((m) => m.groupNumber === "");

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

      <div className="mt-4 flex items-center gap-2 w-full">
        <input
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          placeholder="Search members..."
          className="
      w-full
      rounded-lg border border-slate-600
      bg-slate-800 px-3 py-2
      text-sm text-white
      outline-none
      focus:border-slate-400
    "
        />

        {nameSearch && (
          <button
            onClick={() => setNameSearch("")}
            className="
        rounded-lg px-3 py-2 text-sm
        text-slate-300 hover:text-white
        border border-slate-700 hover:border-slate-500
      "
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Groups</h2>

        <div className="flex gap-2">
          <button
            onClick={createGroup}
            className="
              w-full
              sm:w-auto
              rounded-xl
              border
              border-gray-500/20
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-100/70
              hover:text-black
              cursor-pointer
            "
          >
            +
          </button>

          <button
            onClick={handleSetGroups}
            className="
              w-full
              sm:w-auto
              rounded-xl
              border
              border-green-500/20
              px-6
              py-3
              text-sm
              font-medium
              text-green-300
              transition
              hover:bg-green-500
              hover:text-black
              disabled:cursor-not-allowed
              disabled:opacity-40
              cursor-pointer
            "
          >
            <SubmitText
              isSubmitting={isAssigning}
              text="Set Group"
              loadingText="Setting..."
            />
          </button>
          {/* <button
            onClick={handleResetGroups}
            className="
              w-full
              sm:w-auto
              rounded-xl
              border
              border-blue-500/20
              px-6
              py-3
              text-sm
              font-medium
              text-blue-300
              transition
              hover:bg-blue-500
              hover:text-black
              disabled:cursor-not-allowed
              disabled:opacity-40
              cursor-pointer
            "
          >
            ↺
          </button> */}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((groupKey) => {
          const groupNumber = Number(groupKey);

          const groupMembers = activeMembers.filter(
            (m) => m.groupNumber === groupKey,
          );

          const leader = groupMembers.find((m) => m.groupLeader);
          const nonLeaders = groupMembers.filter((m) => !m.groupLeader);

          return (
            <div
              key={groupKey}
              className="rounded-xl border p-4 space-y-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();

                const memberId = e.dataTransfer.getData("memberId");
                handleDrop(memberId, groupKey);
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Group {groupNumber}</h3>

                <button
                  onClick={() => deleteGroup(groupKey)}
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg
                    text-red-400
                    hover:bg-red-500/10
                    hover:text-red-300
                    transition
                    cursor-pointer
                  "
                  title="Delete Group"
                >
                  ✕
                </button>
              </div>

              {/* Leader */}
              <div>
                <div className="mb-2 text-xs uppercase text-gray-500">
                  Leader
                </div>

                {leader ? (
                  <MemberCard member={leader} nameSearch={nameSearch}>
                    <input
                      type="checkbox"
                      checked
                      onChange={() => setLeader(leader.id, groupKey)}
                    />
                  </MemberCard>
                ) : (
                  <div className="rounded border border-dashed p-3 text-gray-500">
                    No Leader Assigned
                  </div>
                )}
              </div>

              {/* Members */}
              <div>
                <div className="mb-2 text-xs uppercase text-gray-500">
                  Members
                </div>

                <div className="flex flex-wrap gap-2">
                  {nonLeaders.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      nameSearch={nameSearch}
                    >
                      <input
                        type="checkbox"
                        checked={member.groupLeader}
                        onChange={() => setLeader(member.id, groupKey)}
                      />
                    </MemberCard>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-xl border p-4"
        onDragOver={(e) => e.preventDefault()}
      >
        <h3 className="mb-4 font-semibold">Available Members</h3>

        <div
          className="flex flex-wrap gap-2 min-h-24 rounded-lg p-2"
          onDrop={(e) => {
            e.preventDefault();
            const memberId = e.dataTransfer.getData("memberId");
            handleDrop(memberId, "");
          }}
        >
          {ungroupedMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              nameSearch={nameSearch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
