import { useMemo, useState } from "react";

import type { Member } from "../../../../types/member";
import type { Week } from "../../../../types/week";

import { DAYS } from "../../constants/days";
import { EVENT_MAP } from "../../constants/eventMap";
import { formatInputNumber } from "../../../../utils/formatNumbers";
import { isTop10 } from "../../../../stores/scoreStore";
import { getRequirement } from "../../utils/scoring";

type Props = {
  members: Member[];
  week: Week;
};

export default function WeeklyGroups({ members, week }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<number>();

  const groupedMembers = useMemo(() => {
    if (!week) return [];

    const groups = new Map<number, Member[]>();

    members.forEach((member) => {
      if (member.groupNumber == null) return;

      const existing = groups.get(Number(member.groupNumber)) ?? [];

      existing.push(member);

      groups.set(Number(member.groupNumber), existing);
    });

    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([groupNumber, groupMembers]) => ({
        groupNumber,
        leader: groupMembers.find((m) => m.groupLeader),
        members: groupMembers.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [members, week]);

  const activeGroup =
    groupedMembers.find((g) => g.groupNumber === selectedGroup) ??
    groupedMembers[0];

  if (!week) return null;

  return (
    <div className="space-y-4">
      {activeGroup && (
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/40">
          <div className="border-b border-gray-800 px-4 py-3 space-y-3">
            <select
              id="group-select"
              value={activeGroup?.groupNumber ?? ""}
              onChange={(e) => setSelectedGroup(Number(e.target.value))}
              className="
                rounded-lg
                border border-gray-700
                bg-gray-900
                px-3 py-2
                text-sm
                text-gray-200
                outline-none
                focus:border-blue-500
                w-full
              "
            >
              {groupedMembers.map((group) => (
                <option key={group.groupNumber} value={group.groupNumber}>
                  Group {group.groupNumber}
                  {group.leader
                    ? ` — ${group.leader.nickname || group.leader.name}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table
              className="
                w-full
                text-xs
                sm:text-sm
                md:text-base
                text-gray-300
              "
            >
              <thead className="bg-gray-900/80 text-gray-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Member</th>

                  {DAYS.map((day) => (
                    <th key={day} className="px-3 py-2 text-right font-medium">
                      <div className="flex flex-col items-end leading-tight">
                        <span className="text-xs text-gray-500">{day}</span>
                        <span className="text-gray-300">{EVENT_MAP[day]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                {activeGroup.members.map((member) => {
                  const weekMember = week.members.find(
                    (m) => m.id === member.id,
                  );

                  return (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-gray-900/40"
                    >
                      <td className="px-3 py-2 font-medium text-gray-200">
                        {member.nickname || member.name}
                      </td>

                      {DAYS.map((day) => {
                        const value = weekMember?.values[day];

                        const requirement =
                          value != null ? getRequirement(day, week.week) : null;

                        const meetsRequirement =
                          requirement != null &&
                          typeof value === "number" &&
                          value >= requirement;

                        const top10 =
                          meetsRequirement &&
                          isTop10(member.id, week.week, day);

                        return (
                          <td
                            key={day}
                            className="px-3 py-2 text-right tabular-nums"
                          >
                            <span
                              className={
                                value == null
                                  ? "text-gray-500"
                                  : top10
                                    ? "font-medium text-green-400"
                                    : !meetsRequirement
                                      ? "font-medium text-red-400"
                                      : "text-gray-200"
                              }
                            >
                              {value != null && Number(value) !== 0
                                ? formatInputNumber(Number(value))
                                : "—"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
