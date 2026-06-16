import { APP_TABS } from "../constants/tabs";
import type { AppTab } from "../types/app";

type Props = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

function tabClass(active: boolean) {
  return `
    flex-1
    min-w-0
    px-4
    py-4
    text-center
    text-sm
    sm:text-base
    font-medium
    transition-all
    duration-200
    border-r
    border-white/10
    last:border-r-0
    ${
      active
        ? `
          bg-blue-500/20
          text-blue-300
          shadow-inner
        `
        : `
          text-slate-300
          hover:bg-white/5
          hover:text-white
        `
    }
  `;
}

export default function NavigationTabs({ activeTab, onChange }: Props) {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div
          className="
            mt-4
            flex
            overflow-auto no-scrollbar
            rounded-2xl
            border
            border-white/10
            bg-slate-800/50
            backdrop-blur
        "
        >
          {APP_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`${tabClass(activeTab === tab.key)} cursor-pointer`}
            >
              {tab.icon ? (
                <img
                  src={tab.icon}
                  className="mx-auto h-6 w-6 object-contain"
                  alt={tab.label}
                />
              ) : (
                tab.label
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
