import { useEffect, useState } from "react";
import type { Member } from "./types/member";
import {
  getMembers,
  addMember,
  updateStatus,
  renameMember,
} from "./services/api";
import ManageMembers from "./tabs/ManageMembers";
import AllianceDuel from "./tabs/AllianceTabs";

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tab, setTab] = useState<"members" | "AllianceDuel">("members");

  async function loadMembers() {
    const data = await getMembers();
    setMembers(data);
  }

  useEffect(() => {
    async function loadMembers() {
      const data = await getMembers();
      setMembers(data);
    }

    void loadMembers();
  }, []);

  async function handleAdd(name: string, nickname: string) {
    if (!name.trim()) return;

    const duplicates = findDuplicates(name, nickname);

    if (duplicates.length > 0) {
      const message =
        "Duplicate member(s) found:\n\n" +
        duplicates
          .map(
            (m) =>
              `• Name: ${m.name}\n  Nickname: ${m.nickname || "N/A"}\n  Status: ${m.status}`,
          )
          .join("\n\n") +
        "\n\nDo you still want to add this member?";

      const confirmAdd = window.confirm(message);

      if (!confirmAdd) return;
    }

    await addMember(name, nickname);
    loadMembers();
  }

  async function changeStatus(id: string, status: string) {
    await updateStatus(id, status);
    loadMembers();
  }

  async function handleRenameMember(
    id: string,
    name?: string,
    nickname?: string,
  ) {
    await renameMember(id, name, nickname);
    loadMembers();
  }

  function findDuplicates(name: string, nickname: string) {
    return members.filter((m) => {
      return (
        m.name.toLowerCase() === name.toLowerCase() ||
        (nickname && m.nickname?.toLowerCase() === nickname.toLowerCase())
      );
    });
  }

  return (
    <div className=" absolute bg-gray-900 text-white p-4 h-full w-full overflow-auto no-scrollbar">
      <div className="p-2 rounded bg-gray-800 flex justify-center space-x-2 w-fit mx-auto mb-4">
        <button
          onClick={() => setTab("members")}
          className={`p-4 rounded-full transition-colors ${
            tab === "members"
              ? "bg-gray-700 text-white"
              : "text-white hover:bg-gray-700/70"
          }`}
        >
          Manage Members
        </button>

        <button
          onClick={() => setTab("AllianceDuel")}
          className={`p-4 rounded-full transition-colors ${
            tab === "AllianceDuel"
              ? "bg-gray-700 text-white"
              : "text-white hover:bg-gray-700/70"
          }`}
        >
          Alliance Duel
        </button>
      </div>

      {tab === "members" && (
        <ManageMembers
          members={members}
          onAddMember={handleAdd}
          onUpdateStatus={changeStatus}
          onRenameMember={handleRenameMember}
        />
      )}

      {tab === "AllianceDuel" && <AllianceDuel members={members} />}
    </div>
  );
}
