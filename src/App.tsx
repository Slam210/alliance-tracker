import { useState } from "react";
import AppShell from "./components/AppShell";
import LoadingScreen from "./components/LoadingScreen";
import NavigationTabs from "./components/NavigationTabs";
import ManageMembers from "./tabs/ManageMembers/ManageMembers";
import AllianceDuel from "./tabs/AlliianceDuel/AllianceDuel";
import Rankings from "./tabs/Rankings/Rankings";
import { useAppData } from "./hooks/useAppData";
import type { AppTab } from "./types/app";

export default function App() {
  const [tab, setTab] = useState<AppTab>("members");

  const { members, weeks, loading, loadMembers, loadPoints } = useAppData();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell>
      <NavigationTabs activeTab={tab} onChange={setTab} />

      {tab === "members" && (
        <ManageMembers members={members} loadMembers={loadMembers} />
      )}

      {tab === "AllianceDuel" && (
        <AllianceDuel
          members={members}
          weeks={weeks}
          updatePoints={loadPoints}
        />
      )}

      {tab === "Rankings" && <Rankings members={members} weeks={weeks} />}
    </AppShell>
  );
}
