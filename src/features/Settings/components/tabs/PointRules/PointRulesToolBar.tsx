import { Plus } from "lucide-react";

type Props = {
  hasResetChanges: boolean;
  canUpdate: boolean;
  addRule: () => void;
  reset: () => void;
  update: () => void;
};

export default function PointRulesToolbar({
  hasResetChanges,
  canUpdate,
  addRule,
  reset,
  update,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {/* Left side: Add Rule */}
      <button
        onClick={addRule}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
      >
        <Plus className="h-4 w-4" />
        Add Rule
      </button>

      {/* Right side: Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={!hasResetChanges}
          className="rounded-lg border border-slate-700 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>

        <button
          onClick={update}
          disabled={!canUpdate}
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Update
        </button>
      </div>
    </div>
  );
}
