import { useState } from "react";
import DangerCard from "../components/tabs/DataControl/DangerCard";
import ConfirmModal from "../../../components/ConfirmPopup";
import { deleteAllianceDuel } from "../../../services/alliance-duel";
import { deleteMember } from "../../../services/member";
import { deleteAdjustmentLog } from "../../../services/log";
import { deletePointRules } from "../../../services/point-rules";
import { deleteStateRuler } from "../../../services/state-ruler";

type DeleteTarget =
  | "members"
  | "duel"
  | "stateRuler"
  | "pointRules"
  | "logs"
  | null;

type Props = {
  loadMembers: () => void;
  loadWeeks: () => void;
  loadStateRulerData: () => void;
  loadLogs: () => void;
  loadPoints: () => void;
};

export default function DataControlTab({
  loadMembers,
  loadWeeks,
  loadStateRulerData,
  loadLogs,
  loadPoints,
}: Props) {

  const [target, setTarget] = useState<DeleteTarget>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!target) return;

    try {
      setLoading(true);

      switch (target) {
        case "members":
          await deleteMember();
          loadMembers();
          loadWeeks();
          loadLogs();
          loadPoints();
          loadStateRulerData();
          break;

        case "duel":
          await deleteAllianceDuel();
          loadWeeks();
          break;

        case "stateRuler":
          await deleteStateRuler({});
          loadStateRulerData();
          break;

        case "pointRules":
          await deletePointRules();
          loadPoints();
          break;

        case "logs":
          await deleteAdjustmentLog();
          loadLogs();
          break;
      }
    } finally {
      setLoading(false);
      setTarget(null);
    }
  };

  const modalConfig: Record<
    Exclude<DeleteTarget, null>,
    {
      title: string;
      message: React.ReactNode;
    }
  > = {
    members: {
      title: "Delete All Members",
      message: (
        <>
          This will permanently delete <strong>all members</strong>.
          <br />
          <br />
          Because member data cascades, this will also delete:
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Alliance Duel weeks, scores and exceptions</li>
            <li>Adjustment logs</li>
            <li>Any other member-owned data</li>
          </ul>
          <br />
          This action cannot be undone.
        </>
      ),
    },
    duel: {
      title: "Delete Alliance Duel Data",
      message: (
        <>
          This will permanently delete:
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>All Alliance Duel weeks</li>
            <li>All duel scores</li>
            <li>All duel exceptions</li>
          </ul>
          <br />
          This action cannot be undone.
        </>
      ),
    },
    stateRuler: {
      title: "Delete State Ruler Data",
      message: (
        <>
          This will permanently delete all <strong>State Ruler</strong> data.
          <br />
          <br />
          This action cannot be undone.
        </>
      ),
    },
    pointRules: {
      title: "Delete Point Rules",
      message: (
        <>
          This will permanently delete all <strong>point rules</strong>.
          <br />
          <br />
          This action cannot be undone.
        </>
      ),
    },
    logs: {
      title: "Delete Adjustment Logs",
      message: (
        <>
          This will permanently delete all <strong>adjustment logs</strong>.
          <br />
          <br />
          This action cannot be undone.
        </>
      ),
    },
  };

  const config = target ? modalConfig[target] : null;

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Members</h2>

          <DangerCard
            title="Delete All Members"
            description="Deletes every member. This also cascades into deleting all Alliance Duel data, adjustment logs, and any other member-owned data."
            onDelete={() => setTarget("members")}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Alliance Duel</h2>

          <DangerCard
            title="Delete Alliance Duel Data"
            description="Deletes every Alliance Duel week, score, and exception without affecting members."
            onDelete={() => setTarget("duel")}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">End of Season</h2>

          <DangerCard
            title="Delete State Ruler Data"
            description="Deletes all imported State Ruler data."
            onDelete={() => setTarget("stateRuler")}
          />

          <DangerCard
            title="Delete Point Rules"
            description="Deletes all End of Season point rules."
            onDelete={() => setTarget("pointRules")}
          />

          <DangerCard
            title="Delete Adjustment Logs"
            description="Deletes all End of Season adjustment logs."
            onDelete={() => setTarget("logs")}
          />
        </div>
      </div>

      {config && (
        <ConfirmModal
          open
          title={config.title}
          message={config.message}
          loading={loading}
          onClose={() => setTarget(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
