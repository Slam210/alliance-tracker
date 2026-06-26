import type { DayKey } from "../../../../types/week";
import { DAY_STYLES, DAYS } from "../../constants/days";

type Props = {
  week?: string;
  getRequirement: (day: "Mon" | "Weekly" | DayKey, week: string) => number;
};

export default function WeekRequirementsPanel({ week, getRequirement }: Props) {
  if (!week) return null;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-md p-4 space-y-3 w-full">
      <div className="text-sm font-semibold text-gray-200">
        {week} Requirements
      </div>

      {/* DAILY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 md:gap-4">
        {DAYS.map((day) => {
          const value = getRequirement(day, week);
          const style = DAY_STYLES[day];

          return (
            <div
              key={day}
              className={[
                "rounded-2xl",
                "p-5",
                "min-h-28",
                "border border-white/5",
                "ring-1",
                style.bg,
                style.ring,
                "transition duration-200",
                "hover:scale-[1.03] hover:border-white/10",
                "flex flex-col justify-between",
              ].join(" ")}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold uppercase tracking-widest text-white">
                  {day}
                </div>

                <div className="h-2 w-2 rounded-full bg-white/30" />
              </div>

              {/* Value */}
              <div
                className={`text-lg font-semibold tabular-nums ${style.text}`}
              >
                {value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
