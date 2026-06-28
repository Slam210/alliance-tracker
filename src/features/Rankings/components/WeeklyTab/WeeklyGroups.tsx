import { useMemo, useState } from "react";

import type { Member } from "../../../../types/member";
import type { Week } from "../../../../types/week";

import { EVENTS } from "../../constants/days";
import { formatInputNumber } from "../../../../utils/formatNumbers";
import { isTop10 } from "../../../../data/cache/top10Index";
import { getRequirement } from "../../utils/scoring";
import { AllianceSettings } from "../../../../types/settings";

type Props = {
  members: Member[];
  week: Week;
  allianceSettings: AllianceSettings;
  activeMemberIds: Set<string>;
};

export default function WeeklyGroups({ members, week, allianceSettings, activeMemberIds }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<number>();

  const groupedMembers = useMemo(() => {
    if (!week) return [];

    const groups = new Map<number, Member[]>();

    members.forEach((member) => {
      if (member.group_number == null || !activeMemberIds.has(member.id)) return;

      const existing = groups.get(Number(member.group_number)) ?? [];

      existing.push(member);

      groups.set(Number(member.group_number), existing);
    });

    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([group_number, groupMembers]) => ({
        group_number,
        leader: groupMembers.find((m) => m.group_leader),
        members: groupMembers.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [members, week, activeMemberIds]);

  const activeGroup =
    groupedMembers.find((g) => g.group_number === selectedGroup) ??
    groupedMembers[0];

  if (!week) return null;

  return (
    <div className="space-y-4">
      {activeGroup && (
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/40">
          <div className="border-b border-gray-800 px-4 py-3 space-y-3">
            <select
              id="group-select"
              value={activeGroup?.group_number ?? ""}
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
                <option key={group.group_number} value={group.group_number}>
                  Group {group.group_number}
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

                  {EVENTS.map((event) => (
                    <th key={event} className="p-2 md:p-4 text-right font-medium">
                      <div className="flex flex-col items-end leading-tight">
                        <span className="text-gray-300">{event}</span>
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

                      {EVENTS.map((event) => {
                        const value = weekMember?.values[event];

                        const requirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, week.week);

                        const meetsRequirement =
                          requirement != null &&
                          typeof value === "number" &&
                          value >= requirement;

                        const top10 =
                          meetsRequirement &&
                          isTop10(member.id, week.week, event);

                        return (
                          <td
                            key={event}
                            className="px-3 py-2 text-right tabular-nums"
                          >
                            <span
                              className={
                                value === null || value === undefined
                                  ? "text-gray-500"
                                  : top10
                                    ? "font-medium text-green-400"
                                    :  requirement == null || value > requirement
                                    ? "text-gray-200"
                                      : "font-medium text-red-400"
                              }
                            >
                              {value != null
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
