"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function SignInForm() {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login({ name, tag, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-6">Alliance Login</h2>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alliance Name"
          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
        />

        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Alliance Tag"
          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Enter"}
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
      </div>
    </>
  );
}
