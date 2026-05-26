import type { Member } from "../../../types/member";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  filteredMembers: Member[];
  getMemberDayPoints: (memberId: string) => number | null;
  onSelectMember: (member: Member) => void;
};

export default function MemberSearch({
  search,
  setSearch,
  filteredMembers,
  getMemberDayPoints,
  onSelectMember,
}: Props) {
  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member..."
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />

      {search && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl z-50 border border-gray-700 max-h-60 overflow-auto">
          {filteredMembers.length === 0 ? (
            <div className="p-3 text-gray-400">No members found</div>
          ) : (
            filteredMembers.map((m) => {
              const dayPoints = getMemberDayPoints(m.id);

              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-none flex justify-between items-center"
                >
                  <div>
                    <div className="text-white font-medium">{m.name}</div>
                    <div className="text-gray-400 text-sm">
                      {m.nickname || "No nickname"}
                    </div>
                  </div>

                  <div className="text-right">
                    {dayPoints != null ? (
                      <div className="text-green-400 font-bold">
                        {dayPoints.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">—</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
