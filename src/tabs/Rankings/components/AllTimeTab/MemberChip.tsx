import { getMemberColor } from "../../utils/colors";

type MemberChipProps = {
  id: string;
  name: string;
  count: number;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
};

export default function MemberChip({
  id,
  name,
  count,
  selectedMemberId,
  setSelectedMemberId,
}: MemberChipProps) {
  const color = getMemberColor(id);
  const isDimmed = selectedMemberId !== null && id !== selectedMemberId;

  return (
    <div
      className={`px-3 py-2 rounded-xl border cursor-pointer`}
      onClick={() => setSelectedMemberId(selectedMemberId === id ? null : id)}
      style={{
        backgroundColor: color?.bg,
        borderColor: color?.border,
        opacity: isDimmed ? 0.12 : 1,
        filter: isDimmed ? "grayscale(100%)" : "none",
      }}
    >
      <div className="flex items-center gap-2">
        <span>{name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
          {count}x
        </span>
      </div>
    </div>
  );
}
