import { formatOffsetHours } from "../utils/Offset";

const BASE_OFFSET = -120;

type Props = {
  offsetMinutes: number;
  memberCount: number;
  isBase?: boolean;
  displayNames?: string[];
  timezones?: string[];
};

function getHourForOffset(hour: number, rowOffset: number, baseOffset: number) {
  const diffHours = (rowOffset - baseOffset) / 60;

  return (((hour + diffHours) % 24) + 24) % 24;
}

function formatHour(hour24: number) {
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? "PM" : "AM";

  return {
    military: `${hour24.toString().padStart(2, "0")}:00`,
    standard: `${hour12}:00 ${period}`,
  };
}

export default function TimelineRow({
  offsetMinutes,
  memberCount,
  isBase = false,
  displayNames,
  timezones,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-slate-900/70
        p-4
        backdrop-blur-sm
        overflow-auto no-scrollbar
        w-full
      "
    >
      {/* Header */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-base sm:text-lg font-semibold text-slate-100">
            {formatOffsetHours(offsetMinutes)}
          </div>

          {!isBase && (
            <div className="text-xs sm:text-sm text-slate-400">
              {memberCount.toLocaleString()} members
            </div>
          )}
        </div>

        {isBase && (
          <div className="flex flex-row gap-2 sm:items-center">
            <div
              className="
        self-start sm:self-auto
        rounded-full
        border border-emerald-500/20
        bg-emerald-500/10
        px-2 py-1
        sm:px-3
        text-xs
        font-medium
        text-emerald-300
      "
            >
              Game Start Reference
            </div>
            <div
              className="
        self-start sm:self-auto
        rounded-full
        border border-blue-500/20
        bg-blue-500/10
        px-2 py-1
        sm:px-3
        text-xs
        font-medium
        text-blue-300
      "
            >
              Game Halfway Reference
            </div>
            <div
              className="
        self-start sm:self-auto
        rounded-full
        border border-red-500/20
        bg-red-500/10
        px-2 py-1
        sm:px-3
        text-xs
        font-medium
        text-red-300
      "
            >
              Game End Reference
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto no-scrollbar">
        <div
          className="
            grid
            grid-flow-col
            auto-cols-[minmax(4.5rem,1fr)]
            sm:auto-cols-[minmax(5.5rem,1fr)]
            md:auto-cols-[minmax(6.5rem,1fr)]
            gap-1
            sm:gap-2
            min-w-max
          "
        >
          {Array.from({ length: 24 }, (_, index) => {
            const hour = getHourForOffset(index, offsetMinutes, BASE_OFFSET);
            const time = formatHour(hour);

            const isGameStart = index === 0;
            const isGameHalfway = index === 12;
            const isGameEnd = index === 23;

            return (
              <div
                key={index}
                className={`
                  flex flex-col items-center justify-center
                  rounded-lg sm:rounded-xl
                  border
                  px-2 py-2
                  sm:px-3 sm:py-3
                  whitespace-nowrap
                  text-xs sm:text-sm

                  ${
                    isGameStart
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : isGameHalfway
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-200"
                        : isGameEnd
                          ? "border-red-500/30 bg-red-500/10 text-red-200"
                          : "border-white/5 bg-slate-800/60 text-slate-300"
                  }
                `}
              >
                <div>{time.military}</div>

                {!isBase && <div>{time.standard}</div>}
              </div>
            );
          })}
        </div>
      </div>
      {/* Metadata */}
      {!isBase && (
        <div className="my-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Display Names */}
          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Timezone Groups
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayNames?.length ? (
                displayNames.map((name) => (
                  <span
                    key={name}
                    className="
                rounded-full
                border border-blue-500/20
                bg-blue-500/10
                px-2 py-1
                text-xs
                font-medium
                text-blue-200
              "
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None</span>
              )}
            </div>
          </div>

          {/* Timezones */}
          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Individual Timezones
            </div>

            <div className="flex flex-wrap gap-2">
              {timezones?.length ? (
                timezones.map((timezone) => (
                  <span
                    key={timezone}
                    className={`
                rounded-full
                border border-purple-500/20
                bg-purple-500/10
                px-2 py-1
                text-xs
                font-medium
                text-purple-200
                ${timezone === "No Timezone" ? "hidden" : ""}
              `}
                  >
                    {timezone}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
