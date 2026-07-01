import { EVENTS } from "../../../../Rankings/constants/days";
import { formatInputNumber } from "../../../../../utils/formatNumbers";
import { RequirementMode } from "../../../../../types/settings";

type Props = {
  enabled: boolean;
  duration: number | null;
  minimumMode: RequirementMode;
  endGameMode: RequirementMode;
  startRequirements: (number | null)[];
  maxRequirements: (number | null)[];
};

export default function ScalingPreviewGrid({
  enabled,
  duration,
  minimumMode,
  endGameMode,
  startRequirements,
  maxRequirements,
}: Props) {
  if (duration === null) {
    return;
  }
  const getStartValue = (index: number) => {
    if (minimumMode === "unified") {
      return (
        Number(index === 6 ? startRequirements[6] : startRequirements[0]) || 0
      );
    }

    return Number(startRequirements[index]) || 0;
  };

  const getEndValue = (index: number) => {
    if (endGameMode === "unified") {
      return Number(index === 6 ? maxRequirements[6] : maxRequirements[0]) || 0;
    }

    return Number(maxRequirements[index]) || 0;
  };

  const rows = enabled
    ? Array.from({ length: Math.max(duration, 1) }, (_, index) => index + 1)
    : ["Default"];

  const getScaledValue = (week: number, start: number, end: number) => {
    if (!enabled) return start;

    if (duration <= 1) return end;

    const progress = (week - 1) / (duration - 1);

    const value = Math.round(start + (end - start) * progress);

    return Math.round(value / 10_000) * 10_000;
  };

  const hasRequirements =
    startRequirements.some((v) => v !== null && Number(v) > 0) ||
    maxRequirements.some((v) => v !== null && Number(v) > 0);

  if (!hasRequirements) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-2 md:p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          {enabled ? "Scaling Requirements Preview" : "Requirements Preview"}
        </h2>

        <p className="text-sm text-slate-400">
          {enabled
            ? `Preview of requirements across ${duration || 1} week${
                duration === 1 ? "" : "s"
              }.`
            : "Scaling is disabled. Current minimum requirements are shown below."}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-275 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-900 border-b border-slate-800 p-3 text-left text-sm font-medium text-slate-300">
                Week
              </th>

              {EVENTS.map((event) => (
                <th
                  key={event}
                  className="border-b border-slate-800 p-3 text-right text-sm font-medium text-slate-300 whitespace-nowrap"
                >
                  {event}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((week, rowIndex) => {
              const isFirstWeek = enabled && week === 1;
              const isLastWeek =
                enabled && typeof week === "number" && week === duration;

              return (
                <tr
                  key={week}
                  className={
                    rowIndex % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"
                  }
                >
                  <td
                    className={`sticky left-0 z-10 p-3 font-medium border-b border-slate-800 ${
                      isFirstWeek
                        ? "bg-emerald-950 text-emerald-300"
                        : isLastWeek
                          ? "bg-amber-950 text-amber-300"
                          : "bg-slate-900 text-white"
                    }`}
                  >
                    {enabled ? `W${week}` : "Default"}
                  </td>

                  {EVENTS.map((_, index) => {
                    const start = getStartValue(index);
                    const end = getEndValue(index);

                    const value = getScaledValue(
                      typeof week === "number" ? week : 1,
                      start,
                      end,
                    );

                    return (
                      <td
                        key={index}
                        className={`p-3 text-right border-b border-slate-800 whitespace-nowrap ${
                          isFirstWeek
                            ? "text-emerald-300"
                            : isLastWeek
                              ? "text-amber-300"
                              : "text-slate-300"
                        }`}
                      >
                        {formatInputNumber(value)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {enabled && duration > 1 && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-700" />
            <span>Week 1 (Minimum Requirement)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-amber-700" />
            <span>Final Week (End Game Minimum)</span>
          </div>
        </div>
      )}
    </div>
  );
}
