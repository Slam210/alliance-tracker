import type { Week } from "../../../../types/week";

type Props = {
  weeks: Week[];
  selectedWeekIndex: number;
  setSelectedWeekIndex: (index: number) => void;
};

export default function WeekSelector({
  weeks,
  selectedWeekIndex,
  setSelectedWeekIndex,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 sm:px-0 justify-center">
      {weeks.map((week, index) => {
        const active = index === selectedWeekIndex;

        return (
          <button
            key={week.week}
            onClick={() => setSelectedWeekIndex(index)}
            className={`
              shrink-0 snap-start
              rounded-2xl border transition-all
              px-4 py-3 text-left shadow-md w-32 md:w-40 lg:w-48

              ${
                active
                  ? "bg-linear-to-br from-blue-800 to-blue-900 border-blue-500 text-white shadow-blue-900/40"
                  : "bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-850 hover:border-gray-700"
              }
            `}
          >
            {/* Week */}
            <div className="flex items-center justify-between">
              <div className="text-sm sm:text-base font-bold tracking-wide">
                {week.week}
              </div>

              {active && (
                <div className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
              )}
            </div>

            {/* Divider */}
            <div
              className={`my-3 h-px ${active ? "bg-blue-500" : "bg-gray-800"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
