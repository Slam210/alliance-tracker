import type { Member } from "../../../types/member";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";

export default function MemberCard({
  member,
  nameSearch,
  children,
  utcGroups,
  handleDrop,
}: {
  member: Member;
  nameSearch: string;
  children?: React.ReactNode;
  utcGroups: number[];
  handleDrop: (id: string, offset: string) => void;
}) {
  const matchesSearch =
    nameSearch &&
    (String(member.nickname)
      ?.toLowerCase()
      .includes(nameSearch.toLowerCase()) ||
      String(member.name)?.toLowerCase().includes(nameSearch.toLowerCase()));

  const isGrouped = member.groupNumber !== "";
  const isLeader = member.groupLeader;
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("memberId", member.id)}
      className={`
        cursor-move
        rounded-xl
        ${
          isGrouped
            ? "border border-slate-600"
            : "border border-slate-800 opacity-80"
        }
        ${
          matchesSearch
            ? isLeader
              ? "ring-2 ring-green-500 shadow-green-500/20 shadow-md"
              : isGrouped
                ? "ring-2 ring-blue-500 shadow-blue-500/20 shadow-md"
                : "ring-2 ring-yellow-200 shadow-yellow-500/20 shadow-md"
            : ""
        }
        ${isLeader ? "border-l-4 border-l-emerald-500" : ""}
        ${isGrouped ? "bg-slate-800 border-l-4 border-l-blue-500" : "bg-slate-800 border-l-red-500"}
        p-2 m-1
        shadow-sm
        hover:shadow-lg
        hover:scale-105
        min-w-54
        max-w-72
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            {/* Name block */}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-100 truncate">
                {member.nickname || member.name}
              </div>
            </div>
            {/* Offset badge */}
            {getEffectiveOffset(member.displayName) !== undefined && (
              <div
                className="
                  rounded-full
                  bg-slate-700/70
                  px-2 py-0.5
                  text-xs
                  font-medium
                  text-slate-300
                "
              >
                {formatOffsetHours(getEffectiveOffset(member.displayName))}
              </div>
            )}
          </div>
          {member.displayName && (
            <div className="mt-1 text-sm text-slate-200 truncate">
              {member.displayName}
            </div>
          )}

          {(member.timezone ||
            getEffectiveOffset(member.displayName) !== undefined) && (
            <div className="mt-2 space-y-1 text-xs text-slate-300">
              {member.timezone && (
                <div className="inline-flex rounded-md bg-slate-900 px-2 py-1">
                  {member.timezone}
                </div>
              )}
            </div>
          )}
          {member.joinDate && (
            <div className="mt-1 text-sm text-slate-300 truncate">
              Joined: {new Date(member.joinDate).toLocaleDateString()}
            </div>
          )}
          {!member.groupLeader && (
            <select
              value={member.groupNumber}
              onChange={(e) => {
                const value = e.target.value;

                handleDrop(member.id, value === "UNGROUPED" ? "" : value);
              }}
              onClick={(e) => e.stopPropagation()}
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

              {utcGroups.map((offset, index) => (
                <option key={offset} value={String(index + 1)}>
                  {formatOffsetHours(offset)}
                </option>
              ))}
            </select>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
