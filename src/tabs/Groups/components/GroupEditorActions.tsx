import SubmitText from "../../../components/SubmitText";

type Props = {
  createGroup: () => void;
  handleSetGroups: () => void;
  handleResetGroups: () => void;
  isAssigning: boolean;
};

export default function GroupEditorActions({
  createGroup,
  handleSetGroups,
  handleResetGroups,
  isAssigning,
}: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex gap-2">
        <button
          onClick={createGroup}
          className="w-full sm:w-auto rounded-xl border border-gray-500/20 px-6 py-3"
        >
          +
        </button>

        <button
          onClick={handleSetGroups}
          className="w-full sm:w-auto rounded-xl border border-green-500/20 px-6 py-3 text-green-300"
        >
          <SubmitText
            isSubmitting={isAssigning}
            text="Set Group"
            loadingText="Setting..."
          />
        </button>

        <button
          onClick={handleResetGroups}
          className="w-full sm:w-auto rounded-xl border border-blue-500/20 px-6 py-3 text-blue-300"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
