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
    <div className="p-3 sm:p-4 bg-gray-800 rounded-lg space-y-3 w-full max-w-2xl mx-auto">
      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New name"
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />

      <input
        value={newNickname}
        onChange={(e) => setNewNickname(e.target.value)}
        placeholder="New nickname"
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Changes
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
