type Props = {
  hasChanges: boolean;
  canSubmit: boolean;

  onReset: () => void;
  onSubmit: () => void;
  onLogout: () => void;
};

export default function SettingsActionBar({
  hasChanges,
  canSubmit,
  onReset,
  onSubmit,
  onLogout,
}: Props) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 p-2 md:p-4">
      <button
        onClick={onLogout}
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer"
      >
        Logout
      </button>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          disabled={!hasChanges}
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition disabled:opacity-50 disabled:hover:bg-slate-700 cursor-pointer"
        >
          Reset
        </button>

        <button
          disabled={!canSubmit}
          onClick={onSubmit}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50 disabled:hover:bg-indigo-600 cursor-pointer"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
