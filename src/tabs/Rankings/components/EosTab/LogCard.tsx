import type { PointLog } from "../../../../types/derived/eos";

type Props = {
  log: PointLog;
};

const base = "rounded-lg p-3 border shadow-sm transition";

export default function LogCard({ log }: Props) {
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
            {log.week} • {log.day}
          </div>

          <div className="mt-2 text-lg font-bold text-slate-100">
            {log.points.toLocaleString()}
            <span className="text-sm text-slate-400 ml-1">pts</span>
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

    case "eos_bonus":
      return (
        <div className={`${base} border-emerald-500/30 bg-emerald-500/10`}>
          <div className="font-semibold text-emerald-400 flex items-center gap-2">
            Bonus Points
          </div>

          <div className="mt-2 text-lg font-bold text-emerald-300">
            +{log.points.toLocaleString()} pts
          </div>
        </div>
      );

    case "eos_penalty":
      return (
        <div className={`${base} border-red-500/30 bg-red-500/10`}>
          <div className="font-semibold text-red-400 flex items-center gap-2">
            Penalty
          </div>

          <div className="mt-2 text-lg font-bold text-red-300">
            -{log.points.toLocaleString()} pts
          </div>
        </div>
      );
  }
}
