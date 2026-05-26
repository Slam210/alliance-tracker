import type { Member } from "../../../../types/member";

type Props = {
  members: Member[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function MemberPicker({ members, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-h-36 overflow-y-auto">
      {members.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`p-2 rounded text-sm ${
            selectedId === m.id
              ? "bg-blue-700 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}
