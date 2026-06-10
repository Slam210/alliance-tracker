import { isTop10 } from "../../../../stores/scoreStore";
import type { Row } from "../../../../types/derived/summary";
import { DAYS } from "../../constants/days";
import { EVENT_MAP } from "../../constants/eventMap";
import { getRequirement } from "../../utils/scoring";

type Props = {
  rows: Row[];
  selectedMemberId: string;
};

export function MemberWeeklyTable({ rows, selectedMemberId }: Props) {
  if (!rows.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Weekly Breakdown</h3>

      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/40 no-scrollbar">
        <table
          className="
            w-full
            min-w-3xl
            text-[8px]
            sm:text-sm
            md:text-base
            lg:text-lg
            text-gray-300
          "
        >
          <thead className="bg-gray-900/80 text-gray-400">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Week</th>

              {DAYS.map((day) => (
                <th key={day} className="px-3 py-2 text-right font-medium">
                  <div className="flex flex-col items-end leading-tight">
                    <span className="text-xs text-gray-500">{day}</span>
                    <span className="text-gray-300">{EVENT_MAP[day]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {rows.map((row) => (
              <tr
                key={row.week}
                className="hover:bg-gray-900/40 transition-colors"
              >
                <td className="px-3 py-2 font-medium text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">{row.week}</span>

                    {row.exception && (
                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-300">
                        EXEMPT
                      </span>
                    )}
                  </div>
                </td>

                {DAYS.map((day) => {
                  const value = row.values[day];

                  const requirement =
                    row.week && value != null
                      ? getRequirement(day, row.week)
                      : null;

                  const meetsRequirement =
                    requirement != null &&
                    typeof value === "number" &&
                    value >= requirement;

                  return (
                    <td key={day} className="px-3 py-2 text-right tabular-nums">
                      <span
                        className={`
                          inline-block min-w-[2ch]
                          ${
                            value == null
                              ? "text-gray-500"
                              : meetsRequirement
                                ? isTop10(selectedMemberId, row.week, day)
                                  ? "text-green-400 font-medium"
                                  : "text-white"
                                : "text-red-400 font-medium"
                          }
                        `}
                      >
                        {value ?? "—"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
