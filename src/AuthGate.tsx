"use client";

import { useState } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = "auth_ok";
  const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

  const [authorized, setAuthorized] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (input === PASSWORD) {
      setAuthorized(true);
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      setError(true);
    }
  };

  if (authorized) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-center mb-6">
          Restricted Access
        </h2>

        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
          placeholder="Enter password"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Enter
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">
            Wrong password
          </p>
        )}
      </div>
    </div>
  );
}
