type Props = {
  activeTab: "overview" | "logs";
  onTabChange: (tab: "overview" | "logs") => void;
};

export default function ModalTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex border-b border-slate-700/60 bg-slate-900/80 px-4">
      {(["overview", "logs"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
              relative px-5 py-4 text-sm font-medium transition
              ${
                activeTab === tab
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-slate-200"
              }
            `}
        >
          {tab[0].toUpperCase() + tab.slice(1)}

          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
}
