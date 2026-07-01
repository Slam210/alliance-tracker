import HoverGlow from "../../../components/HoverGlow";
import { getEventFromDate } from "../../../constants/week";
import { isTop10 } from "../../../data/cache/top10Index";
import { useAuth } from "../../../hooks/useAuth";
import type { Member } from "../../../types/member";
import { formatDisplayNumber } from '../../../utils/formatNumbers';
import { getWeekSheetName } from "../utils/getWeekSheetName";
import { X } from "lucide-react";

type Props = {
  member: Member;
  points: number | null;
  onClick: () => void;
  requirement: number | null;
  exemptStatus: boolean;
  selectedDate: Date | null;
  startDate: Date;
  onDeleteMember: (member: Member) => void;
};

export default function MemberCard({
  member,
  points,
  onClick,
  requirement,
  exemptStatus,
  selectedDate,
  startDate,
  onDeleteMember,
}: Props) {
  const { role } = useAuth();
  if (!selectedDate) {
    return;
  }


  const isAbove =
    points != null && requirement != null && points >= requirement;

  const weekName = getWeekSheetName(selectedDate, startDate);
  const event = getEventFromDate(selectedDate, startDate)

  if (!weekName || !event || !requirement) {
    return;
  }

  return (
    <div
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-white/10
        bg-linear-to-br
        from-slate-800/80
        to-slate-900/80
        p-4
        sm:p-5
        lg:p-6
        text-left
        transition-all
        duration-200
        hover:border-blue-500/30
        hover:shadow-lg
        hover:shadow-blue-500/10
        hover:scale-105
        cursor-pointer
        relative
      "
    >
      <HoverGlow />
      {role === "admin" && <button
        type="button"
        onClick={(e) => {
                e.stopPropagation();
                onDeleteMember(member);
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
      <div className="flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0 space-y-2">
          <div className="mt-1 truncate text-xs sm:text-sm text-slate-100">
            {member.nickname ? member.nickname : member.name}
          </div>
          {member.nickname && (
            <div className="mt-1 truncate text-xs sm:text-sm text-slate-100">
              {member.name}
            </div>
          )}
          {member.joined_date && (
            <div className="mt-1 truncate text-xs sm:text-sm text-slate-300">
              <>Joined: {new Date(member.joined_date).toLocaleDateString()}</>
            </div>
          )}
          <div className="mt-1 truncate text-xs sm:text-sm text-slate-100">
            {exemptStatus && (
              <span className="text-green-400">EXEMPT ACTIVE</span>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          {points != null ? (
            <div
              className={`
                font-bold text-sm sm:text-base
                transition-colors
                ${
                isAbove && isTop10(member.id, weekName, event)
                    ? "text-emerald-400"
                    : points < requirement
                      ? "text-red-400"
                      : "text-slate-200"
                }
              `}
            >
              {formatDisplayNumber(points) ?? "—"}
            </div>
          ) : (
            <div className="text-xs text-slate-500">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
