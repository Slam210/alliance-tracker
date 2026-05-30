import type { DayKey } from "../../../../types/week";
import { DAY_STYLES, DAYS } from "../../constants/days";
import { getWeekIndex } from "../../utils/week";

type Props = {
  week?: string;
  getWeekStartDate: (week: string) => Date;
  getRequirement: (day: "Mon" | "Weekly" | DayKey, week: string) => number;
};

export default function WeekRequiremzentsPanel({
  week,
  getRequirement,
}: Props) {
  if (!week) return null;

  const weekIndex = getWeekIndex(week);
  console.log(weekIndex);
  const isNewSystem = weekIndex >= 7;

  const weekly = getRequirement("Weekly", week);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-md p-4 space-y-3 w-full">
      <div className="text-sm font-semibold text-gray-200">
        {week} Requirements
      </div>

      {/* DAILY */}
      {!isNewSystem ? (
        // OLD VIEW (W1–W6)
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* DAILY */}
          <div className="rounded-2xl p-5 min-h-28 border border-white/5 ring-1 bg-blue-500/10 ring-blue-500/20 transition duration-200 hover:scale-[1.03] hover:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-widest text-white/60">
                Daily Requirement
              </div>
              <div className="h-2 w-2 rounded-full bg-blue-300/40" />
            </div>

            <div className="text-lg font-semibold tabular-nums text-blue-200">
              {getRequirement("Mon", week).toLocaleString()}
            </div>
          </div>

          {/* WEEKLY */}
          <div className="rounded-2xl p-5 min-h-28 border border-white/5 ring-1 bg-purple-500/10 ring-purple-500/20 transition duration-200 hover:scale-[1.03] hover:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-widest text-white/60">
                Weekly Requirement
              </div>
              <div className="h-2 w-2 rounded-full bg-purple-300/40" />
            </div>

            <div className="text-lg font-semibold tabular-nums text-purple-200">
              {weekly.toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        // NEW VIEW (W7+)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
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
      )}
    </div>
  );
}
