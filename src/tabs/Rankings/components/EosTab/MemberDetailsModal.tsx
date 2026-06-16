import { X } from "lucide-react";
import type {
  EosRewardGroup,
  MemberWithPoints,
} from "../../../../types/derived/eos";
import LogCard from "./LogCard";
import SubmitText from "../../../../components/SubmitText";
import { useMemo, useState } from "react";
import type { adjustmentType } from "../../../../types/log";

type Props = {
  member: MemberWithPoints;
  activeTab: "overview" | "logs";
  onTabChange: (tab: "overview" | "logs") => void;
  onClose: () => void;
  isSaving: boolean;
  handleSubmit: (group: EosRewardGroup) => void;
  isAdding: boolean;
  handleAdd: (
    adjustmentType: adjustmentType,
    count: number,
    points: number,
    reason: string,
  ) => void;
  isDeleting: boolean;
  handleDelete: (logID: string) => void;
};

export default function MemberDetailsModal({
  member,
  activeTab,
  onTabChange,
  onClose,
  isSaving,
  handleSubmit,
  isAdding,
  handleAdd,
  isDeleting,
  handleDelete,
}: Props) {
  const REWARD_GROUPS: EosRewardGroup[] = [
    "contribution",
    "key_player",
    "backbone",
    "alliance_leader",
  ];

  const [rewardGroup, setRewardGroup] = useState<EosRewardGroup>(
    member.eosReward as EosRewardGroup,
  );

  const groupedLogs = useMemo(() => {
    return member.logs.reduce(
      (acc, log) => {
        const key = log.type;

        if (!acc[key]) {
          acc[key] = {
            logs: [],
            total: 0,
          };
        }

        acc[key].logs.push(log);
        acc[key].total += log.points;

        return acc;
      },
      {} as Record<string, { logs: typeof member.logs; total: number }>,
    );
  }, [member]);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleGroup = (key: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [adjustmentType, setAdjustmentType] = useState<adjustmentType>("bonus");

  const [count, setCount] = useState(1);
  const [points, setPoints] = useState(10);
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="
          relative
          flex max-h-[90vh] w-full max-w-4xl flex-col
          overflow-auto no-scrollbar
          rounded-3xl
          border border-slate-700/60
          bg-slate-900
          shadow-2xl shadow-black/60
        "
      >
        {/* Background Glow */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-linear-to-br
            from-blue-500/10
            via-transparent
            to-cyan-500/10
          "
        />

        {/* Header */}
        <div className="relative border-b border-slate-700/60 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                {member.nickname || member.name}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                rounded-xl
                border border-slate-700
                bg-slate-800
                p-2
                text-slate-400
                transition
                hover:border-red-500/50
                hover:bg-slate-700
                hover:text-red-400
              "
            >
              <X size={18} />
            </button>
          </div>

          {/* Summary */}
          <div
            className="
              mt-4
              rounded-2xl
              border border-slate-700/60
              bg-slate-800/50
              p-4
            "
          >
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Total EOS Points
            </div>

            <div className="mt-1 text-3xl font-bold text-blue-400">
              {member.points.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/60 bg-slate-900/80 px-4">
          <button
            onClick={() => onTabChange("overview")}
            className={`
              relative px-5 py-4 text-sm font-medium transition
              ${
                activeTab === "overview"
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-slate-200"
              }
            `}
          >
            Overview
            {activeTab === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-500" />
            )}
          </button>

          <button
            onClick={() => onTabChange("logs")}
            className={`
              relative px-5 py-4 text-sm font-medium transition
              ${
                activeTab === "logs"
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-slate-200"
              }
            `}
          >
            Logs
            {activeTab === "logs" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar p-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div
                className="
                rounded-2xl
                border border-slate-700/60
                bg-slate-800/50
                p-6
                "
              >
                <div className="space-y-5">
                  {/* Reward Group */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Reward Group
                    </label>
                    <select
                      value={rewardGroup}
                      onChange={(e) =>
                        setRewardGroup(e.target.value as EosRewardGroup)
                      }
                      className="
                        w-full h-10
                        rounded-xl
                        border border-slate-700
                        bg-slate-900
                        px-4 py-3
                        text-slate-100
                        outline-none
                        transition
                        focus:border-blue-500
                    "
                    >
                      {REWARD_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group
                            .split("_")
                            .map(
                              (word) => word[0].toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Footer Actions */}
                <div className="mt-auto flex items-center justify-end gap-3 border-t border-slate-700/60 pt-4">
                  <button
                    onClick={onClose}
                    className="
                    rounded-xl
                    border border-slate-700
                    bg-slate-900
                    px-4 py-2
                    text-sm text-slate-300
                    transition
                    hover:bg-slate-800
                    hover:text-slate-100
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleSubmit(rewardGroup)}
                    disabled={isSaving}
                    className="
                    rounded-xl
                    border
                    border-green-500/20
                    bg-green-500/10
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-green-300
                    transition
                    hover:bg-green-500
                    hover:text-black
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    cursor-pointer
                    flex items-center justify-center gap-2
                    min-w-28
                    "
                  >
                    <SubmitText
                      isSubmitting={isSaving}
                      text="Save"
                      loadingText="Saving..."
                    />
                  </button>
                </div>
              </div>
              {/* Manual Adjustment */}
              <div
                className="
                  rounded-xl
                  border border-slate-700/60
                  bg-slate-900/40
                  p-4
                "
              >
                <div className="space-y-4">
                  {/* Bonus / Penalty Toggle */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Adjustment Type
                    </label>

                    <div
                      className="
                        flex overflow-auto no-scrollbar
                        rounded-xl
                        border border-slate-700
                      "
                    >
                      <button
                        type="button"
                        onClick={() => setAdjustmentType("bonus")}
                        className={`
                            flex-1 py-2 text-sm font-medium transition
                            ${
                              adjustmentType === "bonus"
                                ? "bg-green-500 text-black"
                                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                            }
                          `}
                      >
                        Bonus
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdjustmentType("penalty")}
                        className={`
                            flex-1 py-2 text-sm font-medium transition
                            ${
                              adjustmentType === "penalty"
                                ? "bg-red-500 text-black"
                                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                            }
                          `}
                      >
                        Penalty
                      </button>
                    </div>
                  </div>

                  {/* Count + Points */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Count
                      </label>

                      <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        min={1}
                        className="
                            h-10 w-full rounded-xl
                            border border-slate-700
                            bg-slate-900
                            px-4
                            text-slate-100
                          "
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Points Each
                      </label>

                      <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        min={1}
                        className="
              h-10 w-full rounded-xl
              border border-slate-700
              bg-slate-900
              px-4
              text-slate-100
            "
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Reason
                    </label>

                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Enter reason..."
                      className="
            w-full rounded-xl
            border border-slate-700
            bg-slate-900
            px-4 py-3
            text-slate-100
            resize-none
          "
                    />
                  </div>

                  {/* Preview */}
                  <div
                    className={`
          rounded-xl border p-4
          ${
            adjustmentType === "bonus"
              ? "border-green-500/20 bg-green-500/10"
              : "border-red-500/20 bg-red-500/10"
          }
        `}
                  >
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Total Adjustment
                    </div>

                    <div className="mt-1 text-2xl font-bold">
                      {adjustmentType === "bonus" ? "+" : "-"}
                      {(count * points).toLocaleString()}
                      <span className="ml-1 text-sm text-slate-400">pts</span>
                    </div>
                  </div>
                </div>
                {/* Footer Actions */}
                <div className="mt-auto flex items-center justify-end gap-3 border-t border-slate-700/60 pt-4">
                  <button
                    onClick={onClose}
                    className="
                    rounded-xl
                    border border-slate-700
                    bg-slate-900
                    px-4 py-2
                    text-sm text-slate-300
                    transition
                    hover:bg-slate-800
                    hover:text-slate-100
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() =>
                      handleAdd(adjustmentType, count, points, reason)
                    }
                    disabled={isAdding}
                    className="
                    rounded-xl
                    border
                    border-green-500/20
                    bg-green-500/10
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-green-300
                    transition
                    hover:bg-green-500
                    hover:text-black
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    cursor-pointer
                    flex items-center justify-center gap-2
                    min-w-28
                    "
                  >
                    <SubmitText
                      isSubmitting={isAdding}
                      text="Add Log"
                      loadingText="Adding..."
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <>
              {member.logs.length === 0 ? (
                <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 text-center text-slate-500">
                  No logs found.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedLogs).map(([type, group]) => {
                    const isCollapsed = collapsed[type];

                    return (
                      <div
                        key={type}
                        className="rounded-2xl border border-slate-700/60 bg-slate-800/40"
                      >
                        {/* Header */}
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
                            <div className="text-sm text-slate-400">
                              {group.logs.length} logs
                            </div>

                            <div className="text-sm font-semibold text-blue-400">
                              +{group.total.toLocaleString()}
                            </div>

                            <div className="text-slate-500">
                              {isCollapsed ? "▼" : "▲"}
                            </div>
                          </div>
                        </button>

                        {/* Body */}
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
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
