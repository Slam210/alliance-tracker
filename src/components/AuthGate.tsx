"use client";

import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { useAuth } from "../hooks/useAuth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const { loading, authenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Loading...
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        {mode === "login" ? <SignInForm /> : <SignUpForm />}

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            {mode === "login"
              ? "Create a new alliance"
              : "Already have an alliance?"}
          </button>
        </div>
      </div>
    </div>
  );
}
