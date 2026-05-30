import { useState } from "react";

type Props = {
  onAddMember: (name: string, nickname: string) => Promise<void>;
};

export default function AddMemberForm({ onAddMember }: Props) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  async function handleAdd() {
    if (!name.trim()) return;

    await onAddMember(name, nickname);

    setName("");
    setNickname("");
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-4xl
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
          <h2 className="text-lg font-semibold text-white">Add Member</h2>

          <p className="mt-1 text-sm text-slate-400">
            Create a new member entry for your alliance.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Member Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
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
                transition
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
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Optional nickname"
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
                transition
                focus:border-blue-500/50
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>
        </div>

        <div className="flex justify-stretch sm:justify-end">
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="
              w-full
              sm:w-auto
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/10
              px-6
              py-3
              text-sm
              font-medium
              text-blue-300
              transition
              hover:bg-blue-500
              hover:text-black
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}
