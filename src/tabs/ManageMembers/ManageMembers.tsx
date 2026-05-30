import type { Member } from "../../types/member";

import AddMemberForm from "./components/AddMemberForm";
import MemberSearch from "./components/MemberSearch";
import EditMemberForm from "./components/EditMemberForm";

import MemberList from "./components/memberList";
import { useMemberEditor } from "./hooks/useMemberEditor";
import { useMemberActions } from "./hooks/useMemberActions";

type Props = {
  members: Member[];
  loadMembers: () => Promise<void>;
};

export default function ManageMembers({ members, loadMembers }: Props) {
  const { handleAdd, changeStatus, handleRenameMember } = useMemberActions({
    members,
    reloadMembers: loadMembers,
  });

  const {
    selectedMember,
    newName,
    newNickname,
    setNewName,
    setNewNickname,
    handleSelect,
    handleRenameSubmit,
    clearSelection,
  } = useMemberEditor(handleRenameMember);

  return (
    <div className="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
      <AddMemberForm onAddMember={handleAdd} />

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

      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg w-full mx-auto">
        <MemberList members={members} onUpdateStatus={changeStatus} />
      </div>
    </div>
  );
}
