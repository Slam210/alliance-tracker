import { Trash2 } from "lucide-react";
import { Infraction } from "../../../../../types/derived/infractions";

interface Props {
  row: Infraction;
  editable: boolean;
  deleteRow: (id: string) => void;
  updateRow: <K extends keyof Infraction>(
    id: string,
    key: K,
    value: Infraction[K]
  ) => void;
}

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-blue-500";

export default function StateRulerInfractionRow({
  row,
  editable,
  deleteRow,
  updateRow,
}: Props) {
  return (
    <tr className="border-b border-slate-700 last:border-0">
      <td className="px-4 py-3 align-middle">
        {editable ? (
          <input
            className={inputClass}
            value={row.infraction ?? ""}
            onChange={(e) =>
              updateRow(row.id, "infraction", e.target.value)
            }
          />
        ) : (
          row.infraction ?? "-"
        )}
      </td>

      <td className="w-32 px-4 py-3 align-middle">
        {editable ? (
          <input
            className={inputClass}
            type="number"
            value={row.points ?? ""}
            onChange={(e) =>
              updateRow(
                row.id,
                "points",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        ) : (
          <span className="font-semibold text-red-400">
            {row.points ?? "-"}
          </span>
        )}
      </td>

      <td className="px-4 py-3 align-middle">
        {editable ? (
          <input
            className={inputClass}
            value={row.notes ?? ""}
            onChange={(e) =>
              updateRow(row.id, "notes", e.target.value)
            }
          />
        ) : (
          <span className="wrap-break-words">{row.notes || "-"}</span>
        )}
      </td>

      {editable && (
        <td className="w-14 px-4 py-3 text-center align-middle">
          <button
            type="button"
            onClick={() => deleteRow(row.id)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            aria-label="Delete infraction"
          >
            <Trash2 size={18} />
          </button>
        </td>
      )}
    </tr>
  );
}
