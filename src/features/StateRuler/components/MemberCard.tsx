import type { Member } from "../../../types/member";
import type { StateRulerWeek } from "../../../types/stateRuler";

import HoverGlow from "../../../components/HoverGlow";
import { formatDisplayNumber } from "../../../utils/formatNumbers";
import { useAuth } from "../../../hooks/useAuth";
import { X } from "lucide-react";

type StateRulerRow = StateRulerWeek["rows"][number];

type Props = {
  member: Member;
  row?: StateRulerRow;
  onClick: () => void;
  onDelete: () => void;
};

export default function MemberCard({ member, row, onClick, onDelete }: Props) {
  const { role } = useAuth();
  const completed =
    row?.progressRank != null ||
    row?.progressScore != null ||
    row?.clashRank != null ||
    row?.clashScore != null ||
    (row?.infractions?.length ?? 0) > 0;

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
      {role === "admin" && <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="
          absolute
          top-3
          right-3
          rounded-full
          p-1.5
          text-slate-500
          transition
          hover:bg-red-500/20
          hover:text-red-400
          cursor-pointer
          z-10
        "
      >
        <X size={16} />
      </button>}

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

            {(row.infractions?.length ?? 0) > 0 && (
              <div className="text-red-300">
                I:{" "}
                {row.infractions
                  .map((infraction) => infraction.infraction)
                  .join(", ")}
              </div>
            )}

            {!completed && "No data entered"}
          </div>
        )}
      </div>
    </button>
  );
}
