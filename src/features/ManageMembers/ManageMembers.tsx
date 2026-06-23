import type { Member } from "../../types/member";

import AddMemberForm from "./components/AddMemberForm";
import MemberSearch from "./components/MemberSearch";
import EditMemberForm from "./components/EditMemberForm";

import MemberList from "./components/memberList";
import { useMemberEditor } from "./hooks/useMemberEditor";
import { useMemberActions } from "./hooks/useMemberActions";
import SearchMember from "../../components/SearchMember";

type Props = {
  members: Member[];
  loadMembers: () => Promise<void>;
};

export default function ManageMembers({ members, loadMembers }: Props) {
  const {
    handleAdd,
    changeStatus,
    handleRenameMember,
    isAdding,
    isUpdating,
    isChangingStaus,
  } = useMemberActions({
    members,
    reloadMembers: loadMembers,
  });

  const {
    selectedMember,
    newName,
    newNickname,
    timezone,
    display_name,
    nameSearch,
    setNewName,
    setNewNickname,
    handleSelect,
    handleRenameSubmit,
    clearSelection,
    setTimezone,
    setDisplayName,
    setNameSearch,
  } = useMemberEditor(handleRenameMember);

  return (
    <div className="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
      <AddMemberForm onAddMember={handleAdd} isLoading={isAdding} />

      <MemberSearch members={members} onSelect={handleSelect} />

      {selectedMember && (
        <EditMemberForm
          newName={newName}
          newNickname={newNickname}
          setNewName={setNewName}
          setNewNickname={setNewNickname}
          onSave={handleRenameSubmit}
          onCancel={clearSelection}
          timezone={timezone}
          setTimezone={setTimezone}
          display_name={display_name}
          setDisplayName={setDisplayName}
          isLoading={isUpdating}
        />
      )}

      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg w-full mx-auto">
        <SearchMember search={nameSearch} setSearch={setNameSearch} />
        <MemberList
          members={members}
          onUpdateStatus={changeStatus}
          isLoading={isChangingStaus}
          nameSearch={nameSearch}
        />
      </div>
    </div>
  );
}
