import { useMemo, useState } from "react";
import type { EventKey } from "../../../../types/week";
import type { AllTimeEntry } from "../../../../types/derived/counting";
import { getMemberColor } from "../../utils/colors";
import { getMemberNickname } from "../../../../data/cache/memberIndex";
import { EVENTS } from "../../constants/days";

type TabKey = EventKey | "All";

type Props = {
  allTimeTop100ByDay: Record<EventKey, AllTimeEntry[]>;
  selectedMemberId: Set<string>;
  onToggleMember: (name: string) => void;
  title: string;
};

export default function AllTimeEventCard({
  allTimeTop100ByDay,
  selectedMemberId,
  onToggleMember,
  title,
}: Props) {
  const [selectedEvent, setSelectedEvent] = useState<TabKey>("Mod Vehicle Boost");

  const allTimeTop100All = useMemo(() => {
    const all: AllTimeEntry[] = [];

    for (const event of EVENTS) {
      for (const entry of allTimeTop100ByDay[event] ?? []) {
        all.push({
          ...entry,
          event,
        });
      }
    }

    return all.sort((a, b) => b.score - a.score).slice(0, 100);
  }, [allTimeTop100ByDay]);

  const top100 =
    selectedEvent === "All" ? allTimeTop100All : allTimeTop100ByDay[selectedEvent];

  const EVENTS_WITH_ALL: TabKey[] = [...EVENTS, "All"];

  return (
    <div className="space-y-3">
      {/* DAY SELECTOR */}
      <div className="flex gap-3 flex-wrap">
        {EVENTS_WITH_ALL.map((event) => (
          <button
            key={event}
            onClick={() => setSelectedEvent(event)}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer hover:scale-105
        ${
          selectedEvent === event
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
        }
      `}
          >
            {event === "All" ? "All Events" : event}
          </button>
        ))}
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-bold text-white">
        All-Time {title} 100 —{" "}
        {selectedEvent === "All" ? "All Events" : selectedEvent}
      </h2>

      {/* ROW-BASED GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {Array.from({ length: 100 }).map((_, i) => {
          const entry = top100[i];
          const rank = i + 1;

          const color = entry ? getMemberColor(entry.member.id) : null;

          const hasSelection = selectedMemberId.size > 0;

          const isDimmed =
            hasSelection && entry && !selectedMemberId.has(entry.member.id);

          const nickname = entry && getMemberNickname(entry.member.id);

          return (
            <div
              key={rank}
              onClick={() => entry && onToggleMember(entry.member.id)}
              className="
                    relative rounded-xl border
                    p-4 h-fit
                    cursor-pointer transition-all duration-200
                    hover:scale-105 hover:shadow-lg hover:shadow-black/30
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
                      {nickname ? nickname : entry.member.name}
                    </div>

                    {/* score */}
                    <div className="mt-1 text-lg font-bold text-white tracking-tight">
                      {entry.score.toLocaleString()}
                    </div>

                    {/* day (only All view) */}
                    {selectedEvent === "All" && (
                      <div className="mt-1 text-[11px] text-gray-400">
                        {entry.event && entry.event}
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
