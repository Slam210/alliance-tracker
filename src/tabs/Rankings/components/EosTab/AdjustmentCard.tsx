import SubmitText from "../../../../components/SubmitText";
import type { adjustmentType } from "../../../../types/log";

type Props = {
  adjustmentType: adjustmentType;
  setAdjustmentType: (value: adjustmentType) => void;

  count: number;
  setCount: (count: number) => void;

  points: number;
  setPoints: (points: number) => void;

  reason: string;
  setReason: (reason: string) => void;

  total: number;

  isAdding: boolean;

  onClose: () => void;
  onAdd: () => void;
};

export default function AdjustmentCard({
  adjustmentType,
  setAdjustmentType,
  count,
  setCount,
  points,
  setPoints,
  reason,
  setReason,
  total,
  isAdding,
  onClose,
  onAdd,
}: Props) {
  return (
    <div
      className="
        rounded-xl
        border border-slate-700/60
        bg-slate-900/40
        p-4
      "
    >
      <div className="space-y-4">
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

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Count
            </label>

            <input
              type="number"
              value={count}
              min={1}
              onChange={(e) => setCount(Number(e.target.value))}
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
              min={1}
              onChange={(e) => setPoints(Number(e.target.value))}
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

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reason
          </label>

          <textarea
            value={reason}
            rows={3}
            placeholder="Enter reason..."
            onChange={(e) => setReason(e.target.value)}
            className="
              w-full resize-none rounded-xl
              border border-slate-700
              bg-slate-900
              px-4 py-3
              text-slate-100
            "
          />
        </div>

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
            {total.toLocaleString()}
            <span className="ml-1 text-sm text-slate-400">pts</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-700/60 pt-4">
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
          onClick={onAdd}
          disabled={isAdding}
          className="
            flex min-w-28 items-center justify-center gap-2
            rounded-xl
            border border-green-500/20
            bg-green-500/10
            px-5 py-2.5
            text-sm font-medium
            text-green-300
            transition
            hover:bg-green-500
            hover:text-black
            disabled:cursor-not-allowed
            disabled:opacity-50
            cursor-pointer
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
  );
}
