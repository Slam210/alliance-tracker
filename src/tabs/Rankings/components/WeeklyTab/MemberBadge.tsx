type Props = {
  name: string;
  count: number;
  colorClass: string;
};

export default function MemberBadge({ name, count, colorClass }: Props) {
  return (
    <div
      className={`
        px-3 py-2 rounded-xl border
        transition-all
        ${colorClass}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>

        <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
          {count}x
        </span>
      </div>
    </div>
  );
}
