import { useState } from "react";
import type { Week } from "../../types/week";
import type { Member } from "../../types/member";
import WeeklyTab from "./tabs/WeeklyTab";
import AllTimeTab from "./tabs/AllTimeTab";
import MembersTab from "./tabs/MembersTab";
import { getMemberColor } from "./utils/colors";
import { getMemberNickname } from "../../data/cache/memberIndex";
import type { StateRulerResponse } from "../../types/stateRuler";
import type { PointRule } from "../../types/derived/eos";
import EosTab from "./tabs/EosTab";
import type { AdjustmentLog } from "../../types/log";
import { AllianceSettings } from "../../types/settings";

/* TYPES */
type Props = {
  weeks: Week[];
  members: Member[];
  stateRulerData: StateRulerResponse | undefined;
  pointRules: PointRule[];
  loadMembers: () => void;
  loadLogs: () => void;
  logs: AdjustmentLog[];
  allianceSettings: AllianceSettings;
};

type TabKey = "weekly" | "alltime" | "members" | "eos";

export default function Rankings({
  weeks,
  members,
  stateRulerData,
  pointRules,
  loadMembers,
  loadLogs,
  logs,
  allianceSettings
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("weekly");
  const [selectedMemberId, setSelectedMemberId] = useState<Set<string>>(
    new Set(),
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "alltime", label: "All Time" },
    { key: "members", label: "Members" },
    { key: "eos", label: "End of Season" },
  ];

  return (
    <div className="mx-auto w-full">
      {/* TABS */}
      <div className="backdrop-blur border-b border-gray-800 mb-4 mx-auto max-w-7xl">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto px-3 sm:px-0 py-3 sm:py-4 scrollbar-hide justify-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  rounded-full border transition-all duration-200
                  px-4 py-1.5 text-xs
                  sm:px-5 sm:py-2 sm:text-sm
                  lg:px-7 lg:py-2.5 lg:text-base
                  xl:px-8 xl:py-3 xl:text-lg
                  cursor-pointer
                  hover:scale-105
                  ${
                    isActive
                      ? "bg-blue-600 border-blue-500 text-white shadow-md"
                      : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
                  }
              `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* SELECTED MEMBERS BAR */}
      {selectedMemberId.size > 0 && (
        <div className="backdrop-blur border-b border-gray-800 mb-4 mx-auto max-w-7xl pb-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900/40 px-3 py-2">
            {/* Left side: selected names */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Selected:
              </span>

              {[...selectedMemberId].map((id) => {
                const member = members.find((m) => m.id === id);
                if (!member) return null;
                const color = getMemberColor(id);
                const nickname = getMemberNickname(member.id);

                return (
                  <span
                    key={id}
                    className="rounded-full border px-2 py-1 text-xs text-blue-200 hover:scale-105 hover:cursor-pointer"
                    onClick={() => {
                      const next = new Set(selectedMemberId);
                      next.delete(id);
                      setSelectedMemberId(next);
                    }}
                    style={{
                      backgroundColor: color?.bg,
                      borderColor: color?.border,
                    }}
                  >
                    {nickname ? nickname : member.name}
                  </span>
                );
              })}
            </div>

            {/* Right side: clear button */}
            <button
              onClick={() => setSelectedMemberId(new Set())}
              className="
              rounded-md
              border border-gray-700
              bg-gray-950/40
              px-3 py-1.5
              text-xs text-gray-300
              transition
              hover:bg-gray-800
              hover:text-white
              cursor-pointer
            "
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {/* CONTENT */}
      <div>
        {activeTab === "weekly" && (
          <WeeklyTab
            members={members}
            weeks={weeks}
            focusedMembers={selectedMemberId}
            setFocusedMembers={setSelectedMemberId}
            allianceSettings={allianceSettings}
          />
        )}

         {activeTab === "alltime" && (
          <AllTimeTab
            members={members}
            weeks={weeks}
            selectedMemberId={selectedMemberId}
            setSelectedMemberId={setSelectedMemberId}
            allianceSettings={allianceSettings}
          />
        )}

        {activeTab === "members" && (
          <MembersTab
            members={members}
            weeks={weeks}
            allianceSettings={allianceSettings}
          />
        )}
        {/*{activeTab === "eos" && (
          <EosTab
            members={members}
            weeks={weeks}
            stateRulerData={stateRulerData}
            pointRules={pointRules}
            loadMembers={loadMembers}
            loadLogs={loadLogs}
            logs={logs}
          />
        )} */}
      </div>
    </div>
  );
}
