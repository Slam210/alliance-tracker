import { useState } from "react";
import type { Member } from "../types/member";
import MemberList from "../components/memberList";

type Props = {
  members: Member[];
  onAddMember: (name: string, nickname: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onRenameMember: (
    id: string,
    name?: string,
    nickname?: string,
  ) => Promise<void>;
};

export default function ManageMembers({
  members,
  onAddMember,
  onUpdateStatus,
  onRenameMember,
}: Props) {
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  async function handleAdd() {
    if (!name.trim()) return;

    await onAddMember(name, nickname);

    setName("");
    setNickname("");
  }

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.nickname?.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSelect(member: Member) {
    setSelectedMember(member);
    setSearch(member.name);
    setNewName(member.name);
    setNewNickname(member.nickname || "");
  }

  async function handleRenameSubmit() {
    if (!selectedMember) return;

    const hasChanges =
      newName !== selectedMember.name ||
      newNickname !== (selectedMember.nickname || "");

    if (!hasChanges) return;

    await onRenameMember(selectedMember.id, newName.trim(), newNickname.trim());

    setSelectedMember(null);
    setSearch("");
    setNewName("");
    setNewNickname("");
  }

  return (
    <div className="space-y-6">
      {/* Form section */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-800 rounded-lg w-1/2 mx-auto">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Member name"
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
        >
          Add Member
        </button>
      </div>

      {/* Member search */}
      <div className="p-4 bg-gray-800 rounded-lg space-y-3 w-1/2 mx-auto relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search member..."
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
        />

        {/* Dropdown */}
        {search && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl z-50 border border-gray-700">
            {filteredMembers.length === 0 ? (
              <div className="p-3 text-gray-400">No members found</div>
            ) : (
              filteredMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    handleSelect(m);
                    setSearch(""); // CLOSES dropdown immediately
                  }}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-800 last:border-none"
                >
                  <div className="text-white font-medium">{m.name}</div>
                  <div className="text-gray-400 text-sm">
                    {m.nickname || "No nickname"} • {m.status} •{" "}
                    {m.joinDate.slice(0, 10)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit section */}
      {selectedMember && (
        <div className="p-4 bg-gray-800 rounded-lg space-y-3 w-1/2 mx-auto">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New name (optional)"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />

          <input
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="New nickname (optional)"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />

          <button
            onClick={handleRenameSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* List section */}
      <div className="bg-gray-900 p-4 rounded-lg w-1/2 mx-auto">
        <MemberList members={members} onUpdateStatus={onUpdateStatus} />
      </div>
    </div>
  );
}
