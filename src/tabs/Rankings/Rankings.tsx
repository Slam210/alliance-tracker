import { useState } from "react";
import type { DayKey, Week } from "../../types/week";
import type { Member } from "../../types/member";
import { EVENT_MAP } from "./constants/eventMap";
import { type EventDay } from "./constants/days";
import WeeklyTab from "./tabs/WeeklyTab";
import AllTimeTab from "./tabs/AllTimeTab";
import MembersTab from "./tabs/MembersTab";

/* TYPES */
type Props = { weeks: Week[]; members: Member[] };

type TabKey = "weekly" | "alltime" | "members";

export default function Rankings({ weeks, members }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("weekly");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "alltime", label: "All Time" },
    { key: "members", label: "Members" },
  ];

  const getDayLabel = (day: DayKey) => {
    if (day === "Weekly") return "Weekly Calculation";
    return EVENT_MAP[day as EventDay];
  };

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
            shrink-0 rounded-full border transition-all duration-200
            px-4 py-1.5 text-xs
            sm:px-5 sm:py-2 sm:text-sm
            lg:px-7 lg:py-2.5 lg:text-base
            xl:px-8 xl:py-3 xl:text-lg
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

      {/* CONTENT */}
      <div>
        {activeTab === "weekly" && (
          <WeeklyTab
            members={members}
            weeks={weeks}
            getDayLabel={getDayLabel}
          />
        )}

        {activeTab === "alltime" && (
          <AllTimeTab
            members={members}
            weeks={weeks}
            getDayLabel={getDayLabel}
          />
        )}

        {activeTab === "members" && (
          <MembersTab
            members={members}
            weeks={weeks}
            getDayLabel={getDayLabel}
          />
        )}
      </div>
    </div>
  );
}
