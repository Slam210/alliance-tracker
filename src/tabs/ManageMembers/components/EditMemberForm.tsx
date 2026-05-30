type Props = {
  newName: string;
  newNickname: string;
  setNewName: (value: string) => void;
  setNewNickname: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditMemberForm({
  newName,
  newNickname,
  setNewName,
  setNewNickname,
  onSave,
  onCancel,
}: Props) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        rounded-2xl
        border
        border-white/10
        bg-linear-to-br
        from-slate-800/90
        to-slate-900/90
        p-4
        sm:p-5
        lg:p-6
        shadow-lg
      "
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Edit Member</h2>

          <p className="mt-1 text-sm text-slate-400">
            Update the member's name and nickname.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Name
            </label>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New name"
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-slate-900/70
                px-4
                py-3
                text-white
                placeholder:text-slate-500
                focus:border-blue-500/50
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Nickname
            </label>

            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="New nickname"
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-slate-900/70
                px-4
                py-3
                text-white
                placeholder:text-slate-500
                focus:border-blue-500/50
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="
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
            onClick={onSave}
            className="
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/10
              px-5
              py-2.5
              text-sm
              font-medium
              text-blue-300
              transition
              hover:bg-blue-500
              hover:text-black
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
