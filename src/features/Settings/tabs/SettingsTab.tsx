import {
  AllianceInfo,
  AlliancePasswords,
  AllianceSettings,
  AllianceSettingsApi
} from "../../../types/settings";
import RequirementGrid from "../components/tabs/Settings/RequirementGrid";
import AllianceDetailsCard from "../components/tabs/Settings/AllianceDetailsCard";
import { useAllianceForm } from "../hooks/useAllianceForm";
import { useSettingsForm } from "../hooks/useSettingsForm";
import ScalingPreviewGrid from "../components/tabs/Settings/ScalingPreviewGrid";
import { useSettingsReset } from "../hooks/useSettingsReset";
import { useSettingsValidation } from "../hooks/useSettingsValidation";
import SettingsActionBar from "../components/tabs/Settings/SettingsActionBar";
import { logout } from "../../../services/auth";
import { useAuth } from "../../../hooks/useAuth";
import { Week } from "../../../types/week";

type Props = {
  allianceSettings: AllianceSettings;
  allianceInfo: AllianceInfo;
  loadSettings: () => void;
  weeks: Week[];
};

export default function SettingsTab({
  allianceSettings,
  allianceInfo,
  loadSettings,
  weeks,
}: Props) {
  const { role } = useAuth()
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

  const validation = useSettingsValidation({
    allianceInfo,
    allianceSettings,
    name,
    tag,
    server,
    viewerPassword,
    adminPassword,
    startDate,
    scale,
    scaleDuration,
    startRequirements,
    maxRequirements,
  });

  const resetForm = useSettingsReset({
    allianceInfo,
    allianceSettings,
    setName,
    setTag,
    setServer,
    setViewerPassword,
    setAdminPassword,
    setStartDate,
    setScale,
    setScaleDuration,
    setMinimumMode,
    setEndGameMode,
    setStartRequirements,
    setMaxRequirements,
  });

  if (!allianceSettings || !allianceInfo) return null;

  const hasAllianceDuelData = weeks.length > 0;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleSubmit = async () => {
    if (!validation.canSubmit) return;

    const settingsPayload: AllianceSettingsApi = {
      start_date: startDate,

      scale_duration: scale ? scaleDuration : null,

      minimum_mode: minimumMode,
      start_requirements: startRequirements,

      end_game_mode: scale ? endGameMode : "unified",
      max_requirements: scale ? maxRequirements : Array(7).fill(null),
    };

    const alliancePayload: AllianceInfo = {
      alliance_id: allianceId,
      name,
      tag,
      server,
    };

    const passwordPayload: AlliancePasswords = {
      viewer: viewerPassword,
      admin: adminPassword,
    };

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alliance: alliancePayload,
          passwords: passwordPayload,
          settings: settingsPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      loadSettings();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-0">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 space-y-4">
          {role === "admin" && <AllianceDetailsCard
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
          />}

          {role === "admin" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 space-y-4">
              <label className="block text-sm font-medium text-white">
                Start Date
              </label>

              <input
                type="date"
                value={startDate ?? ""}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={hasAllianceDuelData}
                className={`
                  w-full rounded-xl border px-4 py-3 text-white
                  ${
                    hasAllianceDuelData
                      ? "border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed opacity-75"
                      : "border-slate-700 bg-slate-800"
                  }
                  dark:scheme-dark
                `}
              />

              {hasAllianceDuelData && (
                <p className="text-sm text-amber-400">
                  The Alliance Duel start date cannot be changed while Alliance Duel
                  score entries exist. Delete all Alliance Duel data first.
                </p>
              )}
            </div>
          )}

          {role === "admin" && <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 space-y-4">
            <div className="flex justify-between items-center ">
              <h2 className="text-white font-medium">Requirement Scaling</h2>

              <button
                onClick={() => setScale(!scale)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${scale ? "bg-indigo-600" : "bg-zinc-700"
                  }`}
              >
                <span
                  className={`h-4 w-4 bg-white rounded-full transform transition ${scale ? "translate-x-6" : "translate-x-1"
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
                  min={2}
                  value={scaleDuration ?? 2}
                  onChange={(e) => setScaleDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>
            )}
          </div>}

          {role === "admin" && <div
            className={`grid grid-cols-1 ${scale ? "sm:grid-cols-2" : ""} gap-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-2 md:p-4 space-y-2 md:space-y-4`}
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
          </div>}
          <ScalingPreviewGrid
            enabled={scale}
            duration={scaleDuration}
            minimumMode={minimumMode}
            endGameMode={endGameMode}
            startRequirements={startRequirements}
            maxRequirements={maxRequirements}
          />
        </div>
        <SettingsActionBar
          hasChanges={validation.hasChanges}
          canSubmit={validation.canSubmit}
          onReset={resetForm}
          onSubmit={handleSubmit}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
