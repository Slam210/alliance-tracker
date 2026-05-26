import { useMemo, useState } from "react";
import type { DayKey } from "../../../../types/week";
import { DAYS } from "../../constants/days";
import type { AllTimeEntry } from "../../../../types/derived/counting";
import { getMemberColor } from "../../utils/colors";

type TabKey = DayKey | "All";

type Props = {
  getDayLabel: (day: DayKey) => string;
  allTimeTop100ByDay: Record<DayKey, AllTimeEntry[]>;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
};

export default function AllTimeDayCard({
  getDayLabel,
  allTimeTop100ByDay,
  selectedMemberId,
  setSelectedMemberId,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<TabKey>("Mon");

  const allTimeTop100All = useMemo(() => {
    const all: AllTimeEntry[] = [];

    for (const day of DAYS) {
      for (const entry of allTimeTop100ByDay[day] ?? []) {
        all.push({
          ...entry,
          day,
        });
      }
    }

    return all.sort((a, b) => b.score - a.score).slice(0, 100);
  }, [allTimeTop100ByDay]);

  const top100 =
    selectedDay === "All" ? allTimeTop100All : allTimeTop100ByDay[selectedDay];

  const DAYS_WITH_ALL: TabKey[] = [...DAYS, "All"];

  return (
    <div className="space-y-3">
      {/* DAY SELECTOR */}
      <div className="flex gap-3 flex-wrap">
        {DAYS_WITH_ALL.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer
        ${
          selectedDay === day
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
        }
      `}
          >
            {day === "All" ? "All Days" : getDayLabel(day as DayKey)}
          </button>
        ))}
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-bold text-white">
        All-Time Top 100 —{" "}
        {selectedDay === "All" ? "All Days" : getDayLabel(selectedDay)}
      </h2>

      {/* ROW-BASED GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {Array.from({ length: 100 }).map((_, i) => {
          const entry = top100[i];
          const rank = i + 1;

          const color = entry ? getMemberColor(entry.member.id) : null;

          const isDimmed =
            selectedMemberId !== null &&
            entry &&
            entry.member.id !== selectedMemberId;

          return (
            <div
              key={rank}
              onClick={() =>
                entry &&
                setSelectedMemberId(
                  selectedMemberId === entry.member.id ? null : entry.member.id,
                )
              }
              className="
                    relative rounded-xl border
                    p-4 h-fit
                    cursor-pointer transition-all duration-200
                    hover:scale-[1.04] hover:shadow-lg hover:shadow-black/30
                    active:scale-[0.98]
                    backdrop-blur-sm
                "
              style={
                entry
                  ? {
                      backgroundColor: color?.bg,
                      borderColor: color?.border,
                      opacity: isDimmed ? 0.12 : 1,
                      filter: isDimmed ? "grayscale(100%)" : "none",
                    }
                  : {
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                    }
              }
            >
              {entry ? (
                <div className="h-full flex flex-col justify-between">
                  {/* rank */}
                  <div className="flex justify-between items-center text-[11px] text-gray-300 tracking-wide">
                    <span className="font-medium">#{rank}</span>
                  </div>

                  {/* center content */}
                  <div className="flex flex-col items-center justify-center flex-1 text-center">
                    {/* name */}
                    <div className="text-base font-semibold text-white leading-tight truncate w-full">
                      {entry.member.name}
                    </div>

                    {/* score */}
                    <div className="mt-1 text-lg font-bold text-white tracking-tight">
                      {entry.score.toLocaleString()}
                    </div>

                    {/* day (only All view) */}
                    {selectedDay === "All" && (
                      <div className="mt-1 text-[11px] text-gray-400">
                        {entry.day && getDayLabel(entry.day)}
                      </div>
                    )}
                  </div>

                  {/* subtle bottom glow line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30"
                    style={{ backgroundColor: color?.border }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                  —
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
