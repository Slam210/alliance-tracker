import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Member } from "../../../types/member";

interface Props {
  members: Member[];
  onUpdateStatus: (id: string, status: Member["status"]) => void;
}

export default function MemberList({ members, onUpdateStatus }: Props) {
  const activeMembers = members.filter((m) => m.status === "Active");
  const inactiveMembers = members.filter((m) => m.status === "Inactive");
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);

  const renderMember = (member: Member) => {
    const isActive = member.status === "Active";

    return (
      <div
        key={member.id}
        className="
          group
          rounded-2xl
          border border-white/10
          bg-linear-to-br from-slate-800/90 to-slate-900/90
          p-4
          sm:p-5
          lg:p-6
          transition-all
          duration-200
          hover:border-blue-500/30
          hover:shadow-lg
          hover:shadow-blue-500/10
        "
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white wrap-break-words">
                {member.name}
              </h3>

              {member.nickname && (
                <span className="text-sm text-slate-400">
                  ({member.nickname})
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400">
              <span>
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </span>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20"
                    : "bg-red-500/15 text-red-300 ring-1 ring-red-500/20"
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="shrink-0">
            {isActive ? (
              <button
                onClick={() => onUpdateStatus(member.id, "Inactive")}
                className="
                  w-full
                  lg:w-auto
                  rounded-xl
                  border border-red-500/20
                  bg-red-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-red-300
                  transition
                  hover:bg-red-500
                  hover:text-black
                "
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => onUpdateStatus(member.id, "Active")}
                className="
                  w-full
                  lg:w-auto
                  rounded-xl
                  border border-emerald-500/20
                  bg-emerald-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-emerald-300
                  transition
                  hover:bg-emerald-500
                  hover:text-black
                "
              >
                Rejoin
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* ACTIVE */}
      <section>
        <button
          onClick={() => setShowActive((v) => !v)}
          className="
      mb-5
      flex
      w-full
      items-center
      justify-between
      border-b
      border-white/10
      pb-3
      text-left
      transition
      hover:border-blue-500/20
    "
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Active Members
          </h2>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
              {activeMembers.length}
            </span>

            {showActive ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </div>
        </button>

        {showActive && (
          <div
            className="
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-4
        xl:grid-cols-4
      "
          >
            {activeMembers.map(renderMember)}
          </div>
        )}
      </section>

      {/* INACTIVE */}
      {inactiveMembers.length > 0 && (
        <section>
          <button
            onClick={() => setShowInactive((v) => !v)}
            className="
        mb-5
        flex
        w-full
        items-center
        justify-between
        border-b
        border-white/10
        pb-3
        text-left
        transition
        hover:border-red-500/20
      "
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-300">
              Inactive Members
            </h2>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-medium text-red-300">
                {inactiveMembers.length}
              </span>

              {showInactive ? (
                <ChevronDown size={18} className="text-slate-400" />
              ) : (
                <ChevronRight size={18} className="text-slate-400" />
              )}
            </div>
          </button>

          {showInactive && (
            <div
              className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
          opacity-80
          xl:grid-cols-4
        "
            >
              {inactiveMembers.map(renderMember)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
