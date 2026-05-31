import { getMemberNickname } from "../../../../stores/memberStore";
import { getMemberColor } from "../../utils/colors";

type MemberChipProps = {
  id: string;
  name: string;
  count: number;
  selectedMemberId: Set<string>;
  onToggleMember: (name: string) => void;
};

export default function MemberChip({
  id,
  name,
  count,
  selectedMemberId,
  onToggleMember,
}: MemberChipProps) {
  const color = getMemberColor(id);
  const hasSelection = selectedMemberId.size > 0;

  const isDimmed = hasSelection && !selectedMemberId.has(id);
  const nickname = getMemberNickname(id);
  return (
    <div
      className={`px-3 py-2 rounded-xl border cursor-pointer`}
      onClick={() => onToggleMember(id)}
      style={{
        backgroundColor: color?.bg,
        borderColor: color?.border,
        opacity: isDimmed ? 0.12 : 1,
        filter: isDimmed ? "grayscale(100%)" : "none",
      }}
    >
      <div className="flex items-center gap-2 text-white">
        <span>{nickname ? nickname : name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
          {count}x
        </span>
      </div>
    </div>
  );
}
