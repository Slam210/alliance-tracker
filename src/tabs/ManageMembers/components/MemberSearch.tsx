import type { Member } from "../../../types/member";
import { useMemberSearch } from "../hooks/useMemberSearch";

type Props = {
  members: Member[];
  onSelect: (member: Member) => void;
};

export default function MemberSearch({ members, onSelect }: Props) {
  const { search, setSearch, filteredMembers } = useMemberSearch(members);

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      <div
        className="
          rounded-2xl
          border border-white/10
          bg-linear-to-br from-slate-800/90 to-slate-900/90
          p-4
          sm:p-5
          lg:p-6
          shadow-lg
        "
      >
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
            Member Search
          </label>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member..."
            className="
              w-full
              rounded-xl
              border border-white/10
              bg-slate-900/70
              px-4
              py-3
              text-white
              placeholder:text-slate-500
              transition
              focus:border-blue-500/50
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/20
            "
          />
        </div>
      </div>

      {search && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-3
            overflow-hidden
            rounded-2xl
            border border-white/10
            bg-slate-900/95
            shadow-2xl
            backdrop-blur
          "
        >
          <div className="max-h-80 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    onSelect(member);
                    setSearch("");
                  }}
                  className="
                    flex
                    w-full
                    flex-col
                    items-start
                    gap-1
                    border-b
                    border-white/5
                    px-4
                    py-4
                    text-left
                    transition
                    hover:bg-blue-500/10
                  "
                >
                  <span className="font-medium text-white">{member.name}</span>

                  <span className="text-sm text-slate-400">
                    {member.nickname || "No nickname"}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-slate-400">
                No members found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
