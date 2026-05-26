type MemberChipProps = {
  name: string;
  count: number;
  tone: "cyan" | "red" | "gray";
};

export default function MemberChip({ name, count, tone }: MemberChipProps) {
  const toneMap = {
    cyan: "border-cyan-500/20 bg-cyan-500/10",
    red: "border-red-500/20 bg-red-500/10",
    gray: "border-gray-500/20 bg-gray-500/10",
  };

  return (
    <div className={`px-3 py-2 rounded-xl border ${toneMap[tone]}`}>
      <div className="flex items-center gap-2">
        <span>{name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
          {count}x
        </span>
      </div>
    </div>
  );
}
