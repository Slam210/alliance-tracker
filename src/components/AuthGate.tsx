"use client";

import { useEffect, useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

type AuthState = {
  loading: boolean;
  authorized: boolean;
};

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    authorized: false,
  });

  // Check session from server (cookie-based JWT)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setAuth({ loading: false, authorized: false });
          return;
        }

        const data = await res.json();

        setAuth({
          loading: false,
          authorized: data.authenticated === true,
        });
      } catch {
        setAuth({ loading: false, authorized: false });
      }
    };

    checkAuth();
  }, []);

  const handleSuccess = () => {
    setAuth((prev) => ({ ...prev, loading: true }));

    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setAuth({
          loading: false,
          authorized: data.authenticated === true,
        });
      })
      .catch(() => {
        setAuth({ loading: false, authorized: false });
      });
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Loading...
      </div>
    );
  }

  if (auth.authorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        {mode === "login" ? (
          <SignInForm onSuccess={handleSuccess} />
        ) : (
          <SignUpForm onSuccess={handleSuccess} />
        )}

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
