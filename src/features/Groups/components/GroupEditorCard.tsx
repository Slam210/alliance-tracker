import type { Member } from "../../../types/member";
import MemberCard from "./MemberCard";
import UtcGroupSelect from "./UtcGroupSelect";
import type { GroupConfig } from "../hooks/useGroupEditor";
import { useAuth } from "../../../hooks/useAuth";

type Props = {
  group: GroupConfig;
  activeMembers: Member[];
  nameSearch: string;
  utcGroups: number[];

  setGroups: React.Dispatch<React.SetStateAction<GroupConfig[]>>;

  setLocalMembers: React.Dispatch<React.SetStateAction<Member[]>>;

  handleDrop: (memberId: string, group_number: number | null) => void;

  setLeader: (memberId: string, group_number: number) => void;

  deleteGroup: (group_number: number) => void;

  removeMember: (memberId: string) => void;
};

export default function GroupEditorCard({
  group,
  activeMembers,
  nameSearch,
  utcGroups,
  setGroups,
  setLocalMembers,
  handleDrop,
  setLeader,
  deleteGroup,
  removeMember,
}: Props) {
  const {role} = useAuth();
  const groupKey = group.group_number;

  const groupMembers = activeMembers.filter((m) => m.group_number === groupKey);

  const leader = groupMembers.find((m) => m.group_leader);

  const nonLeaders = groupMembers.filter((m) => !m.group_leader);

  return (
    <div
      className="rounded-xl border p-4 space-y-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();

        const memberId = e.dataTransfer.getData("memberId");

        handleDrop(memberId, groupKey);
      }}
    >
      {role === "admin" && <div className="flex items-center justify-between">
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
        >
          ✕
        </button>
      </div>}

      {role === "admin" && <UtcGroupSelect
        group={group}
        utcGroups={utcGroups}
        setGroups={setGroups}
        setLocalMembers={setLocalMembers}
      />}

      <div>
        <div className="mb-2 text-xs uppercase text-gray-500">Leader</div>

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
              className="cursor-pointer"
              onChange={() => setLeader(leader.id, groupKey)}
            />
          </MemberCard>
        ) : (
          <div className="rounded border border-dashed p-3 text-gray-500">
            No Leader Assigned
          </div>
        )}
      </div>

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
              {role === "admin" && <div className="flex items-center gap-2">
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
                  onClick={() => removeMember(member.id)}
                >
                  ✕
                </button>

                <input
                  type="checkbox"
                  checked={member.group_leader}
                  className="cursor-pointer"
                  onChange={() => setLeader(member.id, groupKey)}
                />
              </div>}
            </MemberCard>
          ))}
        </div>
      </div>
    </div>
  );
}
