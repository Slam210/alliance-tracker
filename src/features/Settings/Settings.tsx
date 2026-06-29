import { useState } from "react";

import {
  AllianceInfo,
  AllianceSettings,
} from "../../types/settings";

import SettingsTab from "./tabs/SettingsTab";
import StateRulerInfractionsTab from "./tabs/StateRulerInfractionsTab";
import PointRulesTab from "./tabs/PointRulesTab";
import { PointRule } from "../../types/derived/eos";

type Props = {
  allianceSettings: AllianceSettings;
  allianceInfo: AllianceInfo;
  loadSettings: () => void;
  loadPoints: () => void;
  pointRules: PointRule[];
};

type Tab = "settings" | "pointRules" | "infractions";

export default function Settings({
  allianceSettings,
  allianceInfo,
  loadSettings,
  loadPoints,
  pointRules,
}: Props) {
  const [tab, setTab] = useState<Tab>("settings");

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-0">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">
            Alliance Configuration
          </h1>
        </div>

        <div className="border-b border-slate-800 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("settings")}
              className={`px-4 py-3 border-b-2 transition ${
                tab === "settings"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Settings
            </button>

            <button
              onClick={() => setTab("pointRules")}
              className={`px-4 py-3 border-b-2 transition ${
                tab === "pointRules"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Point Rules
            </button>

            <button
              onClick={() => setTab("infractions")}
              className={`px-4 py-3 border-b-2 transition ${
                tab === "infractions"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              State Ruler Infractions
            </button>
          </div>
        </div>

        <div className="p-4">
          {tab === "settings" && (
            <SettingsTab
              allianceSettings={allianceSettings}
              allianceInfo={allianceInfo}
              loadSettings={loadSettings}
            />
          )}

          {tab === "pointRules" && (
            <PointRulesTab pointRules={pointRules} loadPoints={loadPoints} />
          )}

          {tab === "infractions" && (
            <StateRulerInfractionsTab />
          )}
        </div>
      </div>
    </div>
  );
}
