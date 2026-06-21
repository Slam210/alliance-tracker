import { useMemo, useState } from "react";

import type { MemberWithPoints } from "../../../../types/derived/eos";
import { groupLogs } from "../../utils/log";
import LogGroup from "./LogGroup";

type Props = {
  member: MemberWithPoints;
  isDeleting: boolean;
  handleDelete: (logID: string) => void;
};

export default function LogsTab({ member, isDeleting, handleDelete }: Props) {
  const groupedLogs = useMemo(() => groupLogs(member.logs), [member.logs]);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (member.logs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 text-center text-slate-500">
        No logs found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedLogs).map(([type, group]) => (
        <LogGroup
          key={type}
          type={type}
          group={group}
          isCollapsed={collapsed[type]}
          toggleGroup={toggleGroup}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}
