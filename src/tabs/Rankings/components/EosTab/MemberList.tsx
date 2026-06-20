import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import type {
  EosRewardGroup,
  MemberWithPoints,
} from "../../../../types/derived/eos";
import HoverGlow from "../../../../components/HoverGlow";
import { formatInputNumber } from "../../../../utils/formatNumbers";

type Props = {
  groups: Record<EosRewardGroup, MemberWithPoints[]>;
  onSelect: (member: MemberWithPoints) => void;
  handleXClick: (memberId: string) => void;
  isCanceling: boolean;
};

const COLUMN_INFO = {
  alliance_leader: {
    title: "Alliance Leader",
    cap: 1,
  },
  backbone: {
    title: "Backbone",
    cap: 10,
  },
  key_player: {
    title: "Key Player",
    cap: 30,
  },
  contribution: {
    title: "Contribution Rewards",
    cap: null,
  },
} as const;

export default function MemberList({
  groups,
  onSelect,
  handleXClick,
  isCanceling,
}: Props) {
  const [collapsed, setCollapsed] = useState<
    Partial<Record<EosRewardGroup, boolean>>
  >({});

  function toggleGroup(group: EosRewardGroup) {
    setCollapsed((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }

  return (
    <div
      className="
        space-y-4
      "
    >
      {isCanceling && (
        <div
          className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/60
      backdrop-blur-sm
    "
        >
          <div className="flex flex-col items-center gap-3">
            {/* Spinner */}
            <div
              className="
          h-10 w-10
          animate-spin
          rounded-full
          border-2 border-slate-400
          border-t-transparent
        "
            />

            <div className="text-sm text-slate-300">Cancelling...</div>
          </div>
        </div>
      )}
      {(Object.keys(COLUMN_INFO) as EosRewardGroup[]).map((group) => {
        const members = groups[group];
        const info = COLUMN_INFO[group];
        const isFullCardClickable = group === "contribution";

        return (
          <div
            key={group}
            className="
                rounded-3xl
                border border-slate-700/60
                bg-slate-900/80
                p-4
                shadow-xl shadow-black/30
              "
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-slate-100">
                  {info.title}
                </div>

                <div className="text-sm text-slate-400">
                  {members.length}
                  {info.cap && ` / ${info.cap}`}
                </div>
              </div>

              <button
                onClick={() => toggleGroup(group)}
                className="
                rounded-lg p-2
                text-slate-400
                hover:bg-slate-800
                hover:text-slate-200
                "
              >
                {collapsed[group] ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>

            {!collapsed[group] && (
              <div
                className="
                grid gap-4
                grid-cols-1
                md:grid-cols-3
                xl:grid-cols-5
            "
              >
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    onClick={
                      isFullCardClickable ? () => onSelect(member) : undefined
                    }
                    className={`
                      group relative overflow-auto no-scrollbar
                      rounded-2xl
                      border border-slate-700/60
                      bg-slate-900/80
                      p-4
                      text-left
                      shadow-lg shadow-black/30
                      backdrop-blur-sm

                      transition-all duration-200

                      hover:border-blue-500/50
                      hover:bg-slate-800/90
                      hover:shadow-xl hover:shadow-blue-950/40 hover:scale-105

                      ${isFullCardClickable ? "cursor-pointer" : ""}
                    `}
                  >
                    <HoverGlow />
                    <div className="w-full text-left">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-100">
                            {member.nickname || member.name}
                          </div>

                          <div className="text-xs text-slate-400">
                            Joined{" "}
                            {new Date(member.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div
                            className="
                            ml-2 flex h-7 w-7
                            items-center justify-center
                            rounded-full
                            bg-slate-700
                            text-xs font-bold
                            text-slate-300
                          "
                          >
                            {index + 1}
                          </div>
                          {group !== "contribution" && (
                            <button
                              className={`
                                rounded-lg p-1
                                text-slate-500
                                hover:bg-red-500/10
                                hover:text-red-400
                                `}
                              onClick={() => {
                                handleXClick(member.id);
                              }}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div
                        className={`
                          border-t border-slate-700 pt-2
                          transition-all duration-200

                          ${!isFullCardClickable ? "cursor-pointer hover:translate-y-1 hover:ring-1 hover:ring-slate-700/70" : ""}
                        `}
                        onClick={() => {
                          if (!isFullCardClickable) {
                            onSelect(member);
                          }
                        }}
                      >
                        <div className="text-xs uppercase tracking-wider text-slate-500">
                          Points
                        </div>

                        <div className="text-xl font-bold text-blue-400">
                          {formatInputNumber(member.points).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
