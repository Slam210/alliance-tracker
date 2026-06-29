import { PointRule } from "../../../../../types/derived/eos";
import PointRuleRow from "./PointRuleRow";

type Props = {
  rules: PointRule[];

  updateRule: <K extends keyof PointRule>(
    index: number,
    key: K,
    value: PointRule[K]
  ) => void;
  deleteRule: (index: number) => void;
};

export default function PointRulesTable({
  rules,
  updateRule,
  deleteRule,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
      <table className="min-w-full">
        <thead className="bg-slate-900">
          <tr className="text-left text-sm text-slate-300">
            <th
              className="cursor-pointer px-4 py-3"
            >
              System
            </th>

            <th
              className="cursor-pointer px-4 py-3"
            >
              Type
            </th>

            <th
              className="cursor-pointer px-4 py-3"
            >
              Min Rank
            </th>

            <th
              className="cursor-pointer px-4 py-3"
            >
              Max Rank
            </th>

            <th
              className="cursor-pointer px-4 py-3 text-right"
            >
              Points
            </th>

            <th className="w-16 px-4 py-3" />
          </tr>
        </thead>

        <tbody>
          {rules.map((rule, index ) => (
            <PointRuleRow
              key={index}
              rule={rule}
              index={index}
              updateRule={updateRule}
              deleteRule={deleteRule}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
