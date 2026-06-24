import type { Dispatch, SetStateAction } from "react";

import type { Member } from "../../../types/member";
import type {
  StateRulerEntryType,
  StateRulerWeek,
} from "../../../types/stateRuler";

import SubmitText from "../../../components/SubmitText";
import {
  formatInputNumber,
  parseFormattedNumber,
} from "../../../utils/formatNumbers";

type StateRulerRow = StateRulerWeek["rows"][number];

type Props = {
  member: Member;
  row: StateRulerRow;

  setRow: Dispatch<SetStateAction<StateRulerRow | null>>;

  weekName: string;

  entryType: StateRulerEntryType;
  setEntryType: (type: StateRulerEntryType) => void;

  onClose: () => void;
  onSave: () => void;

  isSaving: boolean;
};

export default function StateRulerModal({
  member,
  row,
  setRow,
  weekName,
  entryType,
  setEntryType,
  onClose,
  onSave,
  isSaving,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-auto no-scrollbar rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="border-b border-slate-700 bg-slate-800/70 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                State Ruler Entry
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {weekName} • {member.nickname || member.name}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="m-4 rounded-xl border border-slate-700 bg-slate-800/50">
          <div className="grid grid-cols-3">
            <button
              type="button"
              onClick={() => setEntryType("progress")}
              className={`rounded-l-xl py-2 text-sm font-medium ${
                entryType === "progress"
                  ? "bg-green-500/70 text-white"
                  : "text-slate-400 hover:bg-green-500 hover:text-black"
              }`}
            >
              Progress
            </button>

            <button
              type="button"
              onClick={() => setEntryType("both")}
              className={`py-2 text-sm font-medium ${
                entryType === "both"
                  ? "bg-blue-500/70 text-white"
                  : "text-slate-400 hover:bg-blue-500 hover:text-black"
              }`}
            >
              Both
            </button>

            <button
              type="button"
              onClick={() => setEntryType("clash")}
              className={`rounded-r-xl py-2 text-sm font-medium ${
                entryType === "clash"
                  ? "bg-red-500/70 text-white"
                  : "text-slate-400 hover:bg-red-500 hover:text-black"
              }`}
            >
              Clash
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {(entryType === "progress" || entryType === "both") && (
            <div>
              <h3 className="mb-3 border-b border-slate-700 pb-2 text-sm font-semibold uppercase tracking-wider text-green-400">
                State Progress
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Rank
                  </label>

                  <input
                    type="number"
                    value={row.progressRank ?? ""}
                    onChange={(e) =>
                      setRow((prev) =>
                        prev
                          ? {
                              ...prev,
                              progressRank:
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value),
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Score
                  </label>

                  <input
                    type="text"
                    value={formatInputNumber(row.progressScore)}
                    onChange={(e) =>
                      setRow((prev) =>
                        prev
                          ? {
                              ...prev,
                              progressScore: parseFormattedNumber(
                                e.target.value,
                              ),
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {(entryType === "clash" || entryType === "both") && (
            <div>
              <h3 className="mb-3 border-b border-red-700 pb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                Capital Clash
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Rank
                  </label>

                  <input
                    type="number"
                    value={row.clashRank ?? ""}
                    onChange={(e) =>
                      setRow((prev) =>
                        prev
                          ? {
                              ...prev,
                              clashRank:
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value),
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Score
                  </label>

                  <input
                    type="text"
                    value={formatInputNumber(row.clashScore)}
                    onChange={(e) =>
                      setRow((prev) =>
                        prev
                          ? {
                              ...prev,
                              clashScore: parseFormattedNumber(e.target.value),
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-800/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="
              min-w-28
              cursor-pointer
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-5
              py-2.5
              text-sm
              font-medium
              text-red-300
              transition
              hover:bg-red-500
              hover:text-black
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="
              min-w-28
              cursor-pointer
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
              disabled:cursor-not-allowed
              disabled:opacity-50
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
    </div>
  );
}
