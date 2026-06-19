import { useEffect, useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import GroupFilters from "../components/GroupFilters";
import MemberCard from "../components/MemberCard";
import { useFilteredMembers } from "../hooks/useFilteredMembers";
import { useGroupFilters } from "../hooks/useGroupedFilters";
import { useGroupOptions } from "../hooks/useGroupOptions";
import { useGroupActions } from "../hooks/useGroupActions";
import SubmitText from "../../../components/SubmitText";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";
import SearchMember from "../../../components/SearchMember";

type GroupConfig = {
  groupNumber: string;
  utcGroup: string;
};

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

  const [localMembers, setLocalMembers] = useState<Member[]>(members);
  const [nameSearch, setNameSearch] = useState("");
  const { isAssigning, handleAssignGroup } = useGroupActions({ loadMembers });

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
      String(m.nickname || m.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [filteredMembers, nameSearch]);

  const { displayNames, timezones, offsets } = useGroupOptions(activeMembers);

  const [groups, setGroups] = useState<GroupConfig[]>(() => {
    const existing = activeMembers
      .map((m) => m.groupNumber)
      .filter((g): g is string => g !== "");

    return Array.from(new Set(existing))
      .map(Number)
      .sort((a, b) => a - b)
      .map((groupNumber) => ({
        groupNumber: String(groupNumber),
        utcGroup: "",
      }));
  });

  const handleDrop = (memberId: string, groupNumber: string | "") => {
    if (groupNumber !== "") {
      setGroups((prev) =>
        prev.some((group) => group.groupNumber === groupNumber)
          ? prev
          : [...prev, { groupNumber, utcGroup: "" }],
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
      const max = prev.length
        ? Math.max(...prev.map((g) => Number(g.groupNumber)))
        : 0;

      const next = String(max + 1);

      if (prev.some((g) => g.groupNumber === next)) {
        return prev;
      }

      return [
        ...prev,
        {
          groupNumber: next,
          utcGroup: "",
        },
      ];
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
    setGroups((prev) => prev.filter((g) => g.groupNumber !== groupKey));

    setLocalMembers((prev) =>
      prev.map((m) =>
        m.groupNumber === groupKey
          ? { ...m, groupNumber: "", groupLeader: false }
          : m,
      ),
    );
  };

  const utcGroups = useMemo(() => {
    const offsets = activeMembers
      .map((m) => getEffectiveOffset(m.displayName))
      .filter((offset): offset is number => offset !== undefined);

    return Array.from(new Set(offsets)).sort((a, b) => a - b);
  }, [activeMembers]);

  const ungroupedMembers = searchedMembers.filter((m) => m.groupNumber === "");

  useEffect(() => {
    let direction = 0;

    const onDragOver = (e: DragEvent) => {
      const y = e.clientY;

      if (y < 100) {
        direction = -1;
      } else if (window.innerHeight - y < 100) {
        direction = 1;
      } else {
        direction = 0;
      }
    };

    const tick = () => {
      if (direction !== 0) {
        window.scrollBy(0, direction * 10);
      }

      requestAnimationFrame(tick);
    };

    window.addEventListener("dragover", onDragOver);

    const frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      cancelAnimationFrame(frame);
    };
  }, []);

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

      <div className="flex items-center justify-center">
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
        {groups.map((group) => {
          const groupKey = group.groupNumber;

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
                <h3 className="font-semibold">Group {groupKey}</h3>

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
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">UTC Group</span>
                <select
                  value={group.utcGroup}
                  onChange={(e) => {
                    const value = e.target.value;

                    setGroups((prev) =>
                      prev.map((g) =>
                        g.groupNumber === group.groupNumber
                          ? { ...g, utcGroup: value }
                          : g,
                      ),
                    );

                    setLocalMembers((prev) =>
                      prev.map((member) => {
                        if (member.groupNumber === group.groupNumber) {
                          return {
                            ...member,
                            groupNumber: "",
                            groupLeader: false,
                          };
                        }

                        if (
                          value === "UNGROUPED" &&
                          member.groupNumber === ""
                        ) {
                          return {
                            ...member,
                            groupNumber: group.groupNumber,
                            groupLeader: false,
                          };
                        }
                        const offset = getEffectiveOffset(member.displayName);

                        if (value !== "UNGROUPED" && String(offset) === value) {
                          return {
                            ...member,
                            groupNumber: group.groupNumber,
                            groupLeader: false,
                          };
                        }

                        return member;
                      }),
                    );
                  }}
                  className="
                      rounded-md
                      border
                      border-slate-700
                      bg-slate-900
                      px-2
                      py-1
                      text-sm
                    "
                >
                  <option value="">Select UTC</option>
                  <option value="UNGROUPED">Ungrouped Members</option>
                  {utcGroups.map((offset) => (
                    <option key={offset} value={String(offset)}>
                      {formatOffsetHours(offset)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leader */}
              <div>
                <div className="mb-2 text-xs uppercase text-gray-500">
                  Leader
                </div>

                {leader ? (
                  <MemberCard
                    member={leader}
                    nameSearch={nameSearch}
                    utcGroups={utcGroups}
                    handleDrop={handleDrop}
                  >
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
                  Members ({nonLeaders.length})
                </div>

                <div className="flex flex-wrap gap-2">
                  {nonLeaders.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      nameSearch={nameSearch}
                      utcGroups={utcGroups}
                      handleDrop={handleDrop}
                    >
                      <div>
                        <button
                          className="
                            flex items-center justify-center
                            rounded-lg
                            text-red-400
                            hover:bg-red-500/10
                            hover:text-red-300
                            transition
                            cursor-pointer
                            hover:scale-105
                          "
                          title="Delete Group"
                          onClick={() => {
                            setLocalMembers((prev) =>
                              prev.map((m) =>
                                m.id === member.id
                                  ? {
                                      ...m,
                                      groupNumber: "",
                                      groupLeader: false,
                                    }
                                  : m,
                              ),
                            );
                          }}
                        >
                          ✕
                        </button>
                        <input
                          type="checkbox"
                          checked={member.groupLeader}
                          className="cursor-pointer"
                          onChange={() => setLeader(member.id, groupKey)}
                        />
                      </div>
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
              utcGroups={utcGroups}
              handleDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
