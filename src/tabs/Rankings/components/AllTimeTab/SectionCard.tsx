type SectionCardProps = {
  title: string;
  description?: string;
  accent: "cyan" | "red" | "blue";
  children: React.ReactNode;
  count: number;
};

export default function SectionCard({
  title,
  description,
  accent,
  children,
  count,
}: SectionCardProps) {
  const accentMap = {
    cyan: "from-cyan-500/60 to-blue-500/40",
    red: "from-red-500/60 to-orange-500/40",
    blue: "from-blue-500/40 to-cyan-500/40",
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-auto no-scrollbar">
      <div className={`h-1 bg-linear-to-r ${accentMap[accent]}`} />

      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between text-white">
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="text-right">{count}</div>
        </div>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
