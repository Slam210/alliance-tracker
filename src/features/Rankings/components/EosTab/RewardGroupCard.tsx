import SubmitText from "../../../../components/SubmitText";
import type { eos_rewardGroup } from "../../../../types/derived/eos";

type Props = {
  rewardGroup: eos_rewardGroup;
  setRewardGroup: (group: eos_rewardGroup) => void;

  rewardGroups: eos_rewardGroup[];

  isSaving: boolean;

  onClose: () => void;
  onSave: () => void;
};

export default function RewardGroupCard({
  rewardGroup,
  setRewardGroup,
  rewardGroups,
  isSaving,
  onClose,
  onSave,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-700/60
        bg-slate-800/50
        p-2 md:p-4 space-y-2 md:space-y-4
      "
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reward Group
          </label>

          <select
            value={rewardGroup ?? ""}
            onChange={(e) => setRewardGroup(e.target.value as eos_rewardGroup)}
            className="
              h-10 w-full
              rounded-xl
              border border-slate-700
              bg-slate-900
              p-1
              text-slate-100
              outline-none
              transition
              focus:border-blue-500
              text-xs sm:text-sm md:text-base lg:text-lg
            "
          >
            {rewardGroups.map((group) => (
              <option key={group} value={group}>
                {group
                  .split("_")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
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
          onClick={onSave}
          disabled={isSaving}
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
            isSubmitting={isSaving}
            text="Save"
            loadingText="Saving..."
          />
        </button>
      </div>
    </div>
  );
}
