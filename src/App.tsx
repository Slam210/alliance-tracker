import { useState } from "react";
import AppShell from "./components/AppShell";
import LoadingScreen from "./components/LoadingScreen";
import NavigationTabs from "./components/NavigationTabs";
import ManageMembers from "./tabs/ManageMembers/ManageMembers";
import AllianceDuel from "./tabs/AlliianceDuel/AllianceDuel";
import Rankings from "./tabs/Rankings/Rankings";
import { useAppData } from "./hooks/useAppData";
import type { AppTab } from "./types/app";
import Groups from "./tabs/Groups/Groups";
import StateRuler from "./tabs/StateRuler/StateRuler";

export default function App() {
  const [tab, setTab] = useState<AppTab>("members");

  const {
    members,
    weeks,
    pointRules,
    stateRulerData,
    logs,
    loading,
    loadMembers,
    loadWeeks,
    loadLogs,
  } = useAppData();
  const [pickleOpen, setPickleOpen] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleTabChange = (next: AppTab) => {
    if (next === "Pickles") {
      setPickleOpen(true);
      return;
    }

    setTab(next);
  };

  return (
    <AppShell>
      <NavigationTabs activeTab={tab} onChange={handleTabChange} />

      {tab === "members" && (
        <ManageMembers members={members} loadMembers={loadMembers} />
      )}

      {tab === "AllianceDuel" && members && weeks && (
        <AllianceDuel members={members} weeks={weeks} loadWeeks={loadWeeks} />
      )}
      {tab === "StateRuler" && members && stateRulerData && (
        <StateRuler
          members={members}
          stateRulerData={stateRulerData}
          loadMembers={loadMembers}
        />
      )}

      {tab === "Rankings" && members && weeks && stateRulerData && (
        <Rankings
          members={members}
          weeks={weeks}
          stateRulerData={stateRulerData}
          pointRules={pointRules}
          loadMembers={loadMembers}
          loadLogs={loadLogs}
          logs={logs}
        />
      )}
      {tab === "Groups" && members && (
        <Groups members={members} loadMembers={loadMembers} />
      )}
      {pickleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPickleOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-bounce rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg">
              🎉 Congratulations, you clicked a useless pickle.
            </div>

            {/* Image */}
            <img
              src="/images/Pickle2.jpg"
              className="max-h-[80vh] max-w-[80vw] rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
