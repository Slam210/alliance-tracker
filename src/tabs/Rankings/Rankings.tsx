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

export default function Rankings({ weeks, members }: Props) {
  const [activeTab, setActiveTab] = useState<"weekly" | "alltime" | "members">(
    "weekly",
  );

  /* LABEL HELPER */
  const getDayLabel = (day: DayKey) => {
    if (day === "Weekly") return "Weekly Calculation";
    return EVENT_MAP[day as EventDay];
  };

  return (
    <div className="p-3 sm:p-4 space-y-6">
      {/* TABS (mobile scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["weekly", "alltime", "members"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab as "weekly" | "alltime" | "members")
            }
            className={`whitespace-nowrap px-4 py-2 rounded text-sm transition ${
              activeTab === tab
                ? "bg-blue-800 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {tab === "weekly"
              ? "Weekly"
              : tab === "alltime"
                ? "All Time"
                : "Members"}
          </button>
        ))}
      </div>

      {/* WEEKLY */}
      {activeTab === "weekly" && (
        <WeeklyTab members={members} weeks={weeks} getDayLabel={getDayLabel} />
      )}

      {/* ALL TIME */}
      {activeTab === "alltime" && (
        <AllTimeTab members={members} weeks={weeks} getDayLabel={getDayLabel} />
      )}

      {/* MEMBERS TAB */}
      {activeTab === "members" && (
        <MembersTab members={members} weeks={weeks} getDayLabel={getDayLabel} />
      )}
    </div>
  );
}
