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
              g.group_number === group.group_number
                ? { ...g, utcGroup: value }
                : g,
            ),
          );

          setLocalMembers((prev) =>
            prev.map((member) => {
              if (member.group_number === group.group_number) {
                return {
                  ...member,
                  group_number: null,
                  group_leader: false,
                };
              }

              if (value === "UNGROUPED" && member.group_number === null) {
                return {
                  ...member,
                  group_number: group.group_number,
                  group_leader: false,
                };
              }

              const offset = getEffectiveOffset(member.display_name);

              if (value !== "UNGROUPED" && String(offset) === value) {
                return {
                  ...member,
                  group_number: group.group_number,
                  group_leader: false,
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
