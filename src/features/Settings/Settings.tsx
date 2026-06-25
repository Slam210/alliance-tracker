import { AllianceInfo, AllianceSettings } from "../../types/settings";
import RequirementGrid from "./components/RequirementGrid";
import AllianceDetailsCard from "./components/AllianceDetailsCard";
import { useAllianceForm } from "./hooks/useAllianceForm";
import { useSettingsForm } from "./hooks/useSettingsForm";
import ScalingPreviewGrid from "./components/ScalingPreviewGrid";

type Props = {
  allianceSettings: AllianceSettings;
  allianceInfo: AllianceInfo;
  loadSettings: () => void;
};

export default function Settings({ allianceSettings, allianceInfo }: Props) {
  const {
    allianceId,
    name,
    setName,
    tag,
    setTag,
    server,
    setServer,
    viewerPassword,
    setViewerPassword,
    adminPassword,
    setAdminPassword,
  } = useAllianceForm(allianceInfo);

  const {
    startDate,
    setStartDate,

    minimumMode,
    setMinimumMode,
    startRequirements,
    setStartRequirements,

    scale,
    setScale,
    scaleDuration,
    setScaleDuration,

    endGameMode,
    setEndGameMode,
    maxRequirements,
    setMaxRequirements,

    updateValue,
  } = useSettingsForm(allianceSettings);

  if (!allianceSettings) return null;

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-0">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">Alliance Settings</h1>
        </div>

        <div className="p-6 space-y-8">
          <AllianceDetailsCard
            allianceId={allianceId}
            name={name}
            setName={setName}
            tag={tag}
            setTag={setTag}
            server={server}
            setServer={setServer}
            viewerPassword={viewerPassword}
            setViewerPassword={setViewerPassword}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-6">
            <label className="block text-sm font-medium text-white">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-6">
            <div className="flex justify-between items-center ">
              <h2 className="text-white font-medium">Requirement Scaling</h2>

              <button
                onClick={() => setScale(!scale)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  scale ? "bg-indigo-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`h-4 w-4 bg-white rounded-full transform transition ${
                    scale ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {scale && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Scale Duration (Weeks)
                </label>

                <input
                  type="number"
                  min={1}
                  value={scaleDuration}
                  onChange={(e) => setScaleDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>
            )}
          </div>

          <div
            className={`grid grid-cols-1 ${scale ? "sm:grid-cols-2" : ""} gap-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-6`}
          >
            <RequirementGrid
              title="Minimum Requirement"
              mode={minimumMode}
              onModeChange={setMinimumMode}
              values={startRequirements}
              onChange={(i, v) => updateValue(i, v, setStartRequirements)}
            />

            {scale && (
              <RequirementGrid
                title="End Game Minimum"
                mode={endGameMode}
                onModeChange={setEndGameMode}
                values={maxRequirements}
                onChange={(i, v) => updateValue(i, v, setMaxRequirements)}
              />
            )}
          </div>
          <ScalingPreviewGrid
            enabled={scale}
            duration={scaleDuration}
            minimumMode={minimumMode}
            endGameMode={endGameMode}
            startRequirements={startRequirements}
            maxRequirements={maxRequirements}
          />
        </div>
      </div>
    </div>
  );
}
