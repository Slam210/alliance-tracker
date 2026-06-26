import { AllianceSettings } from "../../../../types/settings";
import type { EventKey } from "../../../../types/week";
import { EVENT_STYLES, EVENTS } from "../../constants/days";

type Props = {
  week?: string;
  getRequirement: (event: EventKey, START_BY_DAY: (number | null)[], END_BY_DAY: (number | null)[], TOTAL_WEEKS: number | null, weekName?: string,) => number | null;
  allianceSettings: AllianceSettings;
};

export default function WeekRequirementsPanel({ week, getRequirement, allianceSettings }: Props) {
  if (!week) return null;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 shadow-md p-4 space-y-3 w-full">
      <div className="text-sm font-semibold text-gray-200">
        {week} Requirements
      </div>

      {/* DAILY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2 md:gap-4">
        {EVENTS.map((event) => {
          const value = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, week);
          const style = EVENT_STYLES[event];

          return (
            <div
              key={event}
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
                <div className="text-sm font-semibold uppercase tracking-widest text-white">
                  {event}
                </div>

                <div className="h-2 w-2 rounded-full bg-white/30" />
              </div>

              {/* Value */}
              <div
                className={`text-lg font-semibold tabular-nums ${style.text}`}
              >
                {(value ?? "").toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
