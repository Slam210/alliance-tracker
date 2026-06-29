import { Loader2, X } from "lucide-react";
import type { PointLog } from "../../../../types/log";

type Props = {
  log: PointLog;
  isDeleting: boolean;
  handleDelete: (logID: string) => void;
};

const base = "rounded-lg p-3 border shadow-sm transition";

export default function LogCard({ log, isDeleting, handleDelete }: Props) {
  switch (log.type) {
    case "alliance_duel":
      return (
        <div
          className={`${base} border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-blue-400">Alliance Duel</div>
            <span className="text-xs text-blue-300/70">Weekly Event</span>
          </div>

          <div className="mt-2 text-xs text-slate-400">
            {log.week} • {log.event}
          </div>

          <div className="mt-2 text-lg font-bold text-slate-100">
            {log.points.toLocaleString()}
            <span className="text-sm text-slate-400 ml-1">pts</span>
            {log.exception ? (
              <span className="text-sm ml-2 text-green-400">EXEMPT ACTIVE</span>
            ) : (
              ""
            )}
          </div>
        </div>
      );
      case "state_ruler_participation":
        return (
          <div
            className={`${base} border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10`}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-indigo-400">
                State Ruler Participation
              </div>

              <span className="text-xs text-indigo-300/70">
                Participation
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              {log.week}
            </div>

            <div className="mt-3 text-lg font-bold text-slate-100">
              +{log.points.toLocaleString()}
              <span className="ml-1 text-sm text-slate-400">pts</span>
            </div>
          </div>
        );

    case "state_ruler":
      return (
        <div
          className={`${base} border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-purple-400">State Ruler</div>
            <span className="text-xs text-purple-300/70">{log.category}</span>
          </div>

          <div className="mt-2 text-xs text-slate-400">{log.week}</div>

          <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
            <span>Rank #{log.rank}</span>
            <span>{log.score.toLocaleString()} score</span>
          </div>

          <div className="mt-2 text-lg font-bold text-slate-100">
            {log.points.toLocaleString()} pts
          </div>
        </div>
      );

    case "group_leader":
      return (
        <div
          className={`${base} border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10`}
        >
          <div className="font-semibold text-amber-400 flex items-center gap-2">
            Group Leader Bonus
          </div>

          <div className="mt-3 text-xl font-bold text-slate-100">
            +{log.points.toLocaleString()}
            <span className="text-sm text-slate-400 ml-1">pts</span>
          </div>
        </div>
      );
    case "adjustment": {
      const total = log.count * log.points;
      const isPenalty = log.adjustmentType === "penalty";

      return (
        <>
          {isDeleting && (
            <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          )}

          <div
            className={`${base} relative ${
              isPenalty
                ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
            }`}
          >
            <button
              onClick={() => handleDelete(log.logID)}
              disabled={isDeleting}
              className="
                absolute right-2 top-2
                rounded-md p-1
                text-slate-400
                transition
                hover:bg-black/20
                hover:text-white
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <X size={16} />
            </button>

            <div className="flex items-center justify-between pr-8">
              <div
                className={`font-semibold ${
                  isPenalty ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {isPenalty ? "Penalty" : "Bonus"}
              </div>

              <span
                className={`text-xs ${
                  isPenalty ? "text-red-300/70" : "text-emerald-300/70"
                }`}
              >
                Adjustment
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-400">{log.reason}</div>

            <div className="mt-2 text-sm text-slate-300">
              {log.count} × {Math.abs(log.points).toLocaleString()} pts
            </div>

            <div
              className={`mt-3 text-xl font-bold ${
                isPenalty ? "text-red-300" : "text-emerald-300"
              }`}
            >
              {isPenalty ? "-" : "+"}
              {total.toLocaleString()}
              <span className="ml-1 text-sm text-slate-400">pts</span>
            </div>
          </div>
        </>
      );
    }
  }
}
