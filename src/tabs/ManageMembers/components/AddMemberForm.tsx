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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800 rounded-lg w-full max-w-2xl mx-auto">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Member name"
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />

      <button
        onClick={handleAdd}
        className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white"
      >
        Add Member
      </button>
    </div>
  );
}
