"use client";

import AllianceDuel from "../../../features/AlliianceDuel/AllianceDuel";
import { useApp } from "../../../hooks/useApp";

export default function AllianceDuelPage() {
  const { members, weeks, loadWeeks, allianceSettings } = useApp();

  if (!members || !weeks || !allianceSettings) return null;

  return (
    <AllianceDuel
      members={members}
      weeks={weeks}
      loadWeeks={loadWeeks}
      allianceSettings={allianceSettings.settings}
    />
  );
}
