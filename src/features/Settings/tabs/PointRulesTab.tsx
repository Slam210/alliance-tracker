import { useAuth } from "../../../hooks/useAuth";
import { PointRule } from "../../../types/derived/eos";
import PointRulesTable from "../components/tabs/PointRules/PointRulesTable";
import PointRulesToolbar from "../components/tabs/PointRules/PointRulesToolBar";
import { usePointRules } from "../hooks/usePointRules";

type Props = {
  pointRules: PointRule[];
  loadPoints: () => void;
};

export default function PointRulesTab({ pointRules, loadPoints }: Props) {
  const { allianceId, role } = useAuth();
  const isAdmin = role === "admin";

  const {
    rules,
    hasResetChanges,
    canUpdate,
    updateRule,
    addRule,
    deleteRule,
    resetRules,
    saveRules,
  } = usePointRules(pointRules, allianceId ?? "", loadPoints);

  return (
    <div className="space-y-6">
      {/* Toolbar only visible to admins */}
      {isAdmin && (
        <PointRulesToolbar
          hasResetChanges={hasResetChanges}
          canUpdate={canUpdate}
          addRule={addRule}
          reset={resetRules}
          update={saveRules}
        />
      )}

      {/* Table becomes read-only for non-admins */}
      <PointRulesTable
        rules={rules}
        updateRule={isAdmin ? updateRule : undefined}
        deleteRule={isAdmin ? deleteRule : undefined}
        isAdmin={isAdmin}
      />
    </div>
  );
}
