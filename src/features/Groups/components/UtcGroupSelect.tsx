import type { Member } from "../../../types/member";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";
import type { GroupConfig } from "../hooks/useGroupEditor";

type Props = {
  group: GroupConfig;
  utcGroups: number[];
  setGroups: React.Dispatch<React.SetStateAction<GroupConfig[]>>;
  setLocalMembers: React.Dispatch<React.SetStateAction<Member[]>>;
};

export default function UtcGroupSelect({
  group,
  utcGroups,
  setGroups,
  setLocalMembers,
}: Props) {
  return (
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

              if (value === "UNGROUPED" && member.groupNumber === "") {
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
        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
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
  );
}
