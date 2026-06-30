import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import type {
  eos_rewardGroup,
  MemberWithPoints,
} from "../../../../types/derived/eos";

import HoverGlow from "../../../../components/HoverGlow";
import { formatInputNumber } from "../../../../utils/formatNumbers";
import { useAuth } from "../../../../hooks/useAuth";

type Props = {
  groups: Record<eos_rewardGroup, (MemberWithPoints & { globalRank: number })[]>;
  onSelect: (member: MemberWithPoints) => void;
  handleXClick: (memberId: string) => void;
  isCanceling: boolean;
};

const COLUMN_INFO = {
  alliance_leader: { title: "Alliance Leader", cap: 1 },
  backbone: { title: "Backbone", cap: 10 },
  key_player: { title: "Key Player", cap: 30 },
  contribution: { title: "Contribution Rewards", cap: null },
} as const;

export default function MemberList({
  groups,
  onSelect,
  handleXClick,
  isCanceling,
}: Props) {
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState<
    Partial<Record<eos_rewardGroup, boolean>>
  >({});

  function toggleGroup(group: eos_rewardGroup) {
    setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  return (
    <div className="space-y-4">
      {isCanceling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            <div className="text-sm text-slate-300">Cancelling...</div>
          </div>
        </div>
      )}

      {(Object.keys(COLUMN_INFO) as eos_rewardGroup[]).map((group) => {
        const members = groups[group];
        const info = COLUMN_INFO[group];
        const isFullCardClickable = group === "contribution";

        return (
          <div
            key={group}
            className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-xl"
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
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
              >
                {collapsed[group] ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>

            {!collapsed[group] && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={
                      isFullCardClickable ? () => onSelect(member) : undefined
                    }
                    className={`group relative rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-lg transition-all hover:scale-105 ${
                      isFullCardClickable ? "cursor-pointer" : ""
                    }`}
                  >
                    <HoverGlow />

                    <div className="mb-2 flex justify-between">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-100">
                          {member.nickname || member.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          Joined{" "}
                          {new Date(member.joined_date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* STABLE GLOBAL RANK */}
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                          {member.globalRank}
                        </div>

                        {group !== "contribution" && role === "admin" && (
                          <button
                            className="rounded-lg p-1 text-slate-500 hover:text-red-400"
                            onClick={() => handleXClick(member.id)}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div
                      className="border-t border-slate-700 pt-2"
                      onClick={() => {
                        if (!isFullCardClickable) onSelect(member);
                      }}
                    >
                      <div className="text-xs uppercase text-slate-500">
                        Points
                      </div>
                      <div className="text-xl font-bold text-blue-400">
                        {formatInputNumber(member.points).toLocaleString()}
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
