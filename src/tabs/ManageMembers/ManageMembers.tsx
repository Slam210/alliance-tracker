import type { Member } from "../../types/member";

import AddMemberForm from "./components/AddMemberForm";
import MemberSearch from "./components/MemberSearch";
import EditMemberForm from "./components/EditMemberForm";

import MemberList from "./components/memberList";
import { useMemberEditor } from "./hooks/useMemberEditor";

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
  const {
    selectedMember,
    newName,
    newNickname,
    setNewName,
    setNewNickname,
    handleSelect,
    handleRenameSubmit,
    clearSelection,
  } = useMemberEditor(onRenameMember);

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <AddMemberForm onAddMember={onAddMember} />

      <MemberSearch members={members} onSelect={handleSelect} />

      {selectedMember && (
        <EditMemberForm
          newName={newName}
          newNickname={newNickname}
          setNewName={setNewName}
          setNewNickname={setNewNickname}
          onSave={handleRenameSubmit}
          onCancel={clearSelection}
        />
      )}

      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg w-full max-w-2xl mx-auto">
        <MemberList members={members} onUpdateStatus={onUpdateStatus} />
      </div>
    </div>
  );
}
