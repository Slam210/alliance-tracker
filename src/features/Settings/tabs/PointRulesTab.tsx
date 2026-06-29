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
    const { allianceId } = useAuth();
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
            <PointRulesToolbar
                hasResetChanges={hasResetChanges}
                canUpdate={canUpdate}
                addRule={addRule}
                reset={resetRules}
                update={saveRules}
            />

            <PointRulesTable
                rules={rules}
                updateRule={updateRule}
                deleteRule={deleteRule}
            />
        </div>
    );
}
