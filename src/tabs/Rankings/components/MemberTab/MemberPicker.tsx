import HoverGlow from "../../../../components/HoverGlow";
import type { Member } from "../../../../types/member";

type Props = {
  members: Member[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function MemberPicker({ members, selectedId, onSelect }: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-2
        sm:gap-3
        max-h-40
        overflow-y-auto
        rounded-lg
        pr-1
        no-scrollbar scrollbar-thumb-gray-700
      "
    >
      {members.map((m) => {
        const isSelected = selectedId === m.id;

        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`
              group
              relative
              w-full
              rounded-lg
              px-3 py-2
              text-sm
              font-medium
              text-left
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/30
              cursor-pointer
              hover:scale-105
              ${
                isSelected
                  ? "bg-blue-700 text-white shadow-md ring-1 ring-blue-400/40"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <span
              className={`
                absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r
                transition-all duration-200
                ${isSelected ? "bg-blue-400" : "bg-transparent group-hover:bg-gray-600"}
              `}
            />
            <HoverGlow />
            <div className="truncate">
              {m.nickname ? m.nickname : m.name} -{" "}
              {new Date(m.joinDate).toLocaleDateString()}
            </div>
          </button>
        );
      })}
    </div>
  );
}
