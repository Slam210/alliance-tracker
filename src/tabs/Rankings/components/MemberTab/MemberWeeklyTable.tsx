import type { Row } from "../../../../types/derived/summary";
import { DAYS } from "../../constants/days";
import { EVENT_MAP } from "../../constants/eventMap";

type Props = {
  rows: Row[];
};

export function MemberWeeklyTable({ rows }: Props) {
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

                {DAYS.map((day) => (
                  <td
                    key={day}
                    className="px-3 py-2 text-right tabular-nums text-gray-300"
                  >
                    <span className="inline-block min-w-[2ch]">
                      {row.values[day] ?? "—"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
