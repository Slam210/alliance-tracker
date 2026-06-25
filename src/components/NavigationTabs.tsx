"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { APP_TABS } from "../constants/tabs";
import { TabConfig } from "../types/app";
import { tabClass } from "./TabClass";

export default function NavigationTabs() {
  const [isOpen, setIsOpen] = useState(false);
  const [pickleOpen, setPickleOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.split("/")[1] || "";

  const handleClick = (tab: TabConfig) => {
    if (tab.key === "Pickles") {
      setPickleOpen(true);
      return;
    }

    router.push(`/${tab.key}`);
    setIsOpen(false);
  };

  return (
    <>
      <div className="p-4 sm:px-6 lg:px-8">
        {/* Mobile */}
        <div className="md:hidden fixed top-1 left-1 z-50 p-2">
          <button
            onClick={() => setIsOpen((p) => !p)}
            className="rounded-lg border border-white/10 bg-slate-800/50 p-2 backdrop-blur"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isOpen && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-800/95 backdrop-blur">
              {APP_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleClick(tab)}
                  className={tabClass(currentTab === tab.key)}
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
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:flex mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur max-w-7xl mx-auto">
          {APP_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleClick(tab)}
              className={tabClass(currentTab === tab.key)}
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

      {/* PICKLE MODAL */}
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

            <img
              src="/images/Pickle2.jpg"
              className="max-h-[80vh] max-w-[80vw] rounded-xl shadow-2xl"
              alt="Pickle"
            />
          </div>
        </div>
      )}
    </>
  );
}
