import type { Member } from "../../../types/member";

type Props = {
  member: Member;
  points: number | null;
  onClick: () => void;
  requirement: number | null;
  exemptStatus: boolean;
};

export default function MemberCard({
  member,
  points,
  onClick,
  requirement,
  exemptStatus,
}: Props) {
  const isAbove =
    points != null && requirement != null && points >= requirement;
  return (
    <button
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
        hover:-translate-y-0.5
        cursor-pointer
      "
    >
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
          {member.joinDate && (
            <div className="mt-1 truncate text-xs sm:text-sm text-slate-300">
              <>Joined: {new Date(member.joinDate).toLocaleDateString()}</>
            </div>
          )}
          <div className="mt-1 truncate text-xs sm:text-sm text-slate-100">
            {exemptStatus && (
              <span className="text-green-400">EXEMPT ACTIVE</span>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="shrink-0 text-right">
          {points != null ? (
            <div
              className={`
                font-bold text-sm sm:text-base
                transition-colors
                ${
                  points == null
                    ? "text-slate-500"
                    : isAbove
                      ? "text-emerald-400"
                      : "text-red-400"
                }
              `}
            >
              {points?.toLocaleString() ?? "—"}
            </div>
          ) : (
            <div className="text-xs text-slate-500">—</div>
          )}
        </div>
      </div>
    </button>
  );
}
