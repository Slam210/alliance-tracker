import type { Row } from "../../../../types/derived/summary";
import { DAYS } from "../../constants/days";

type Props = {
  rows: Row[];
};

export function MemberWeeklyTable({ rows }: Props) {
  if (!rows.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-200">Weekly Breakdown</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-150 text-sm text-gray-300 border border-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="p-2 text-left">Week</th>

              {DAYS.map((day) => (
                <th key={day} className="p-2 text-right">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.week}
                className="border-t border-gray-800 hover:bg-gray-900/40"
              >
                <td className="p-2 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200">{row.week}</span>

                    {row.exception && (
                      <span className="mx-2 px-4 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                        EXEMPT
                      </span>
                    )}
                  </div>
                </td>

                {DAYS.map((day) => (
                  <td key={day} className="p-2 text-right tabular-nums">
                    {row.values[day] ?? "—"}
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
