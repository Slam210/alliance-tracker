import type { Member } from "../../../types/member";
import type { StateRulerWeek } from "../../../types/stateRuler";

import HoverGlow from "../../../components/HoverGlow";
import { formatDisplayNumber } from "../../../utils/formatNumbers";

type StateRulerRow = StateRulerWeek["rows"][number];

type Props = {
  member: Member;
  row?: StateRulerRow;
  onClick: () => void;
};

export default function MemberCard({ member, row, onClick }: Props) {
  const completed =
    row?.progressRank != null ||
    row?.progressScore != null ||
    row?.clashRank != null ||
    row?.clashScore != null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        group
        w-full
        cursor-pointer
        rounded-2xl
        border
        bg-linear-to-br
        from-slate-800/80
        to-slate-900/80
        p-4
        text-left
        transition-all
        duration-200
        hover:scale-105
        hover:border-blue-500/30
        hover:bg-slate-800
        hover:shadow-lg
        hover:shadow-blue-500/10
        sm:p-5
        lg:p-6
        ${completed ? "border-green-500" : "border-slate-700"}
      `}
    >
      <HoverGlow />

      <div className="font-medium">{member.nickname || member.name}</div>

      <div className="mt-1 text-xs text-slate-400">
        {!row ? (
          "No data entered"
        ) : (
          <div className="space-y-1">
            {(row.progressRank || row.progressScore) && (
              <div>
                P: #{row.progressRank ?? "-"} •{" "}
                {formatDisplayNumber(row.progressScore ?? 0)}
              </div>
            )}

            {(row.clashRank || row.clashScore) && (
              <div>
                C: #{row.clashRank ?? "-"} •{" "}
                {formatDisplayNumber(row.clashScore ?? 0)}
              </div>
            )}

            {!completed && "No data entered"}
          </div>
        )}
      </div>
    </button>
  );
}
