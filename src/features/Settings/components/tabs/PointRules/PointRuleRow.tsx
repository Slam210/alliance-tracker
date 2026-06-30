import { Trash2 } from "lucide-react";
import type { PointRule } from "../../../../../types/derived/eos";
import {
  inputClass,
  numberClass,
  RANK_REQUIRED_TYPES,
  SYSTEMS,
  SystemType,
  TYPES,
} from "../../../utils/tabs/PointRules/pointRuleConstants";

type Props = {
  rule: PointRule;
  index: number;

  updateRule?: <K extends keyof PointRule>(
    index: number,
    key: K,
    value: PointRule[K]
  ) => void;

  deleteRule?: (index: number) => void;

  isAdmin?: boolean;
};

export default function PointRuleRow({
  rule,
  index,
  updateRule,
  deleteRule,
  isAdmin,
}: Props) {
  const system = rule.system;
  const type = rule.type;

  const safeUpdate = updateRule ?? (() => {});
  const safeDelete = deleteRule ?? (() => {});

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-900/30">
      {/* SYSTEM */}
      <td className="px-4 py-3">
        {isAdmin ? (
          <select
            value={system ?? ""}
            onChange={(e) => {
              const nextSystem = e.target.value as SystemType;

              safeUpdate(index, "system", nextSystem);

              const validTypes = TYPES[nextSystem];
              const defaultType = validTypes[0]?.value;

              if (defaultType) {
                safeUpdate(index, "type", defaultType);
                safeUpdate(index, "requiresRequirement", defaultType === "rank");
                safeUpdate(index, "minRank", null);
                safeUpdate(index, "maxRank", null);
              }
            }}
            className={inputClass}
          >
            <option value="" disabled>
              Select system...
            </option>

            {SYSTEMS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-slate-200">{system ?? "—"}</span>
        )}
      </td>

      {/* TYPE */}
      <td className="px-4 py-3">
        {isAdmin ? (
          <select
            value={type ?? ""}
            disabled={!system}
            onChange={(e) => {
              const nextType = e.target.value;

              safeUpdate(index, "type", nextType);

              const requiresRank = RANK_REQUIRED_TYPES.has(nextType);

              safeUpdate(index, "requiresRequirement", requiresRank);

              if (!requiresRank) {
                safeUpdate(index, "minRank", null);
                safeUpdate(index, "maxRank", null);
              }
            }}
            className={inputClass}
          >
            <option value="" disabled>
              Select type...
            </option>

            {(system ? TYPES[system] : []).map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-slate-200">{type ?? "—"}</span>
        )}
      </td>

      {/* MIN RANK */}
      <td className="px-4 py-3">
        {type && RANK_REQUIRED_TYPES.has(type) ? (
          isAdmin ? (
            <input
              type="number"
              value={rule.minRank ?? ""}
              onChange={(e) =>
                safeUpdate(
                  index,
                  "minRank",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className={numberClass}
            />
          ) : (
            <span className="text-slate-200">{rule.minRank ?? "—"}</span>
          )
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </td>

      {/* MAX RANK */}
      <td className="px-4 py-3">
        {type && RANK_REQUIRED_TYPES.has(type) ? (
          isAdmin ? (
            <input
              type="number"
              value={rule.maxRank ?? ""}
              onChange={(e) =>
                safeUpdate(
                  index,
                  "maxRank",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className={numberClass}
            />
          ) : (
            <span className="text-slate-200">{rule.maxRank ?? "—"}</span>
          )
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </td>

      {/* POINTS */}
      <td className="px-4 py-3">
        {isAdmin ? (
          <input
            type="number"
            value={rule.points ?? ""}
            onChange={(e) =>
              safeUpdate(
                index,
                "points",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            className={`${numberClass} text-center`}
          />
        ) : (
          <span className="text-slate-200">{rule.points ?? "—"}</span>
        )}
      </td>

      {/* DELETE */}
      <td className="px-4 py-3 text-center">
        {isAdmin ? (
          <button
            onClick={() => safeDelete(index)}
            className="cursor-pointer rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </td>
    </tr>
  );
}
