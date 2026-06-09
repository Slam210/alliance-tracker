import { formatOffsetHours } from "../utils/Offset";

const BASE_OFFSET = -120;

type Props = {
  offsetMinutes: number;
  memberCount: number;
  isBase?: boolean;
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
          <div className="flex flex-col gap-2 sm:items-center">
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
        border border-red-500/20
        bg-red-500/10
        px-2 py-1
        sm:px-3
        text-xs
        font-medium
        text-red-300
      "
            >
              Game Start Reference
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto no-scrollbar">
        <div
          className="
      inline-grid
      grid-cols-12
      gap-1
      sm:gap-2
      min-w-full
    "
        >
          {Array.from({ length: 24 }, (_, index) => {
            const hour = getHourForOffset(index, offsetMinutes, BASE_OFFSET);
            const time = formatHour(hour);

            const isGameStart = index === 0;

            return (
              <div
                key={index}
                className={`
            flex flex-col items-center justify-center
            rounded-lg sm:rounded-xl
            border
            px-2 py-2
            sm:px-3 sm:py-3
            min-w-20
            sm:min-w-24
            md:min-w-28
            whitespace-nowrap
            
            ${
              isGameStart
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : index === 23
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-white/5 bg-slate-800/60 text-slate-300"
            }
          `}
              >
                <div>{time.military}</div>

                <div>{time.standard}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
