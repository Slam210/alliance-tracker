type Props = {
  week?: string;
  getWeekStartDate: (week: string) => Date;
  getRequirement: (day: "Mon" | "Weekly", week: string) => number;
};

export default function WeekRequirementsPanel({ week, getRequirement }: Props) {
  if (!week) return null;

  const daily = getRequirement("Mon", week);
  const weekly = getRequirement("Weekly", week);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-md p-4 space-y-3">
      <div className="text-sm font-semibold text-gray-200">
        {week} Requirements
      </div>

      <div className="space-y-2">
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-blue-300/80">
            Daily Requirement
          </div>

          <div className="mt-1 text-sm font-semibold tabular-nums text-blue-100">
            {daily.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg bg-black/20 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-purple-300/80">
            Weekly Requirement
          </div>

          <div className="mt-1 text-sm font-semibold tabular-nums text-purple-100">
            {weekly.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
