import { useAuth } from "../../../hooks/useAuth";
import StateRulerInfractionRow from "../components/tabs/Infractions/StateRulerInfractionRow";
import { useStateRulerInfractions } from "../hooks/useStateRulerInfractions";
import { Infraction } from "../../../types/derived/infractions";
import PointRulesToolbar from "../components/tabs/PointRules/PointRulesToolBar";

interface Props {
  infractions: Infraction[];
  loadInfractions: () => void;
}

export default function StateRulerInfractionsTab({
  infractions,
  loadInfractions,
}: Props) {
  const { role } = useAuth();

  const {
    rows,
    addRow,
    deleteRow,
    resetRows,
    update,
    updateRow,
    hasChanges,
    canUpdate,
  } = useStateRulerInfractions(infractions, loadInfractions);

  const isAdmin = role === "admin";

  return (
    <div className="space-y-6">
      {isAdmin && (
        <PointRulesToolbar
          hasResetChanges={hasChanges}
          canUpdate={canUpdate}
          addRule={addRow}
          reset={resetRows}
          update={update}
        />
      )}
      <div className="hidden md:grid md:grid-cols-[2fr_120px_3fr] gap-4 px-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        <div>Infraction</div>
        <div>Points</div>
        <div>Notes</div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left">Infraction</th>
              <th className="w-32 px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">Notes</th>
              {isAdmin && <th className="w-14 px-4 py-3" />}
            </tr>
          </thead>

          <tbody className="bg-slate-900">
            {rows.map((row) => (
              <StateRulerInfractionRow
                key={row.id}
                row={row}
                editable={isAdmin}
                updateRow={updateRow}
                deleteRow={deleteRow}
              />
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
            No infractions.
          </div>
        )}
      </div>
    </div>
  );
}
