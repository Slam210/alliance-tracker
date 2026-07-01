"use client";

import LoadingScreen from "../components/LoadingScreen";
import { AppContext } from "../context/AppContext";
import { useAppData } from "../hooks/useAppData";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, ...data } = useAppData();

  return (
    <AppContext.Provider value={data}>
      {children}

      {loading && (
        <div className="fixed inset-0 z-999">
          <LoadingScreen />
        </div>
      )}
    </AppContext.Provider>
  );
}
