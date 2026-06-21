import type { MemberDaySummary } from "../../../../types/derived/summary";
import type { DayKey } from "../../../../types/week";
import { DAYS } from "../../constants/days";
import { formatInputNumber } from "../../../../utils/formatNumbers";

type Props = {
  summary: Record<DayKey, MemberDaySummary> | null;
  getDayLabel: (day: DayKey) => string;
};

export function MemberSummaryCards({ summary, getDayLabel }: Props) {
  if (!summary) return null;

  return (
    <div className="flex flex-row overflow-x-auto gap-3 no-scrollbar">
      {DAYS.map((day) => {
        const s = summary[day];

        return (
          <div
            key={day}
            className="bg-gray-950 border border-gray-800 rounded-xl p-3 w-72 sm:w-80"
          >
            <div className="text-xs text-gray-400 mb-2">{getDayLabel(day)}</div>

            <div className="space-y-2">
              <div>
                <div className="text-[10px] text-gray-500">Best</div>
                <div className="text-yellow-400 font-bold tabular-nums">
                  {Number(formatInputNumber(Number(s.best))) !== 0
                    ? formatInputNumber(Number(s.best))
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500">Avg</div>
                <div className="text-blue-300 font-medium tabular-nums">
                  {Number(formatInputNumber(Number(s.avg.toFixed(0)))) !== 0
                    ? formatInputNumber(Number(s.avg.toFixed(0)))
                    : "—"}
                </div>
              </div>

              {s.showSpread && (
                <div>
                  <div className="text-[10px] text-gray-500">Worst</div>
                  <div className="text-orange-400 font-bold tabular-nums">
                    {Number(formatInputNumber(Number(s.worst))) !== 0
                      ? formatInputNumber(Number(s.worst))
                      : "—"}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] text-gray-500">Entries</div>
                <div className="text-gray-200 tabular-nums">{s.entries}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
