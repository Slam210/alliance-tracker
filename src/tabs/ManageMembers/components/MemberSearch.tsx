import type { Member } from "../../../types/member";
import { useMemberSearch } from "../hooks/useMemberSearch";

type Props = {
  members: Member[];
  onSelect: (member: Member) => void;
};

export default function MemberSearch({ members, onSelect }: Props) {
  const { search, setSearch, filteredMembers } = useMemberSearch(members);

  return (
    <div className="p-3 sm:p-4 bg-gray-800 rounded-lg space-y-3 w-full max-w-2xl mx-auto relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member..."
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />

      {search && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl z-50 border border-gray-700 max-h-60 overflow-auto">
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                onSelect(m);
                setSearch("");
              }}
              className="p-3 hover:bg-gray-700 cursor-pointer"
            >
              <div className="text-white font-medium">{m.name}</div>

              <div className="text-gray-400 text-sm">
                {m.nickname || "No nickname"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
