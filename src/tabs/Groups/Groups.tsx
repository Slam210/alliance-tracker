"use client";

import { useState } from "react";
import type { Member } from "../../types/member";
import ViewGroups from "./tabs/ViewGroups";
import GroupsTimeline from "./tabs/GroupsTimeline";
import GroupEditor from "./tabs/GroupEditor";

type Props = {
  members: Member[];
};

type TabKey = "viewer" | "editor" | "timeline";

export default function Groups({ members }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("viewer");
  const tabs: { key: TabKey; label: string }[] = [
    { key: "viewer", label: "Viewer" },
    { key: "editor", label: "Editor" },
    { key: "timeline", label: "Timeline" },
  ];

  return (
    <div className="flex flex-col gap-6 text-white">
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
            cursor-pointer
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

      {activeTab === "viewer" && <ViewGroups members={members} />}

      {activeTab === "editor" && <GroupEditor members={members} />}

      {activeTab === "timeline" && <GroupsTimeline members={members} />}
    </div>
  );
}
