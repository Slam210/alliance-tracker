import { Trash2 } from "lucide-react";
import type { Week } from "../../../../types/week";
import { useAuth } from "../../../../hooks/useAuth";

type Props = {
  weeks: Week[];
  selectedWeekIndex: number;
  setSelectedWeekIndex: (index: number) => void;
  onDeleteWeek: (weekNumber: number) => void;
};

export default function WeekSelector({
  weeks,
  selectedWeekIndex,
  setSelectedWeekIndex,
  onDeleteWeek,
}: Props) {
  const { role } = useAuth();
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar justify-center">
      {weeks.map((week, index) => {
        const active = index === selectedWeekIndex;
        const weekNumber = Number(week.week.replace("W", ""));

        return (
          <div
            key={week.week}
            onClick={() => setSelectedWeekIndex(index)}
            className={`
              rounded-2xl border transition-all
              text-left shadow-md w-12 sm:w-24 md:w-36 lg:w-48 cursor-pointer p-2

              ${
                active
                  ? "bg-linear-to-br from-blue-800 to-blue-900 border-blue-500 text-white shadow-blue-900/40"
                  : "bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-850 hover:border-gray-700"
              }
            `}
          >
            {/* Week */}
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs sm:text-base font-bold">
                {week.week}
              </div>

              <div className="flex items-center gap-2">
                {active && role === "admin" && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWeek(weekNumber);
                      }}
                      className="rounded-md p-1 text-red-300 hover:bg-red-500/20 hover:text-red-200 cursor-pointer"
                      title={`Delete ${week.week}`}
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              className={`my-3 h-px ${
                active ? "bg-blue-500" : "bg-gray-800"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
