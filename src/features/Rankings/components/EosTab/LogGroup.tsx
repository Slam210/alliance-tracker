import type { PointLog } from "../../../../types/log";
import LogCard from "./LogCard";

type Props = {
  type: string;
  group: {
    logs: PointLog[];
    total: number;
  };
  isCollapsed: boolean;
  toggleGroup: (key: string) => void;
  isDeleting: boolean;
  handleDelete: (logID: string) => void;
};

export default function LogGroup({
  type,
  group,
  isCollapsed,
  toggleGroup,
  isDeleting,
  handleDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40">
      <button
        onClick={() => toggleGroup(type)}
        className="
          flex w-full items-center justify-between
          px-4 py-3
          hover:bg-slate-800/60
          transition
        "
      >
        <div className="text-sm font-semibold text-slate-200 capitalize">
          {type.replaceAll("_", " ")}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400">{group.logs.length} logs</div>

          <div className="text-sm font-semibold text-blue-400">
            {group.total > 0 ? "+" : ""}
            {group.total.toLocaleString()}
          </div>

          <div className="text-slate-500">{isCollapsed ? "▼" : "▲"}</div>
        </div>
      </button>

      {!isCollapsed && (
        <div className="space-y-3 p-4 pt-0">
          {group.logs.map((log, index) => (
            <LogCard
              key={index}
              log={log}
              isDeleting={isDeleting}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
