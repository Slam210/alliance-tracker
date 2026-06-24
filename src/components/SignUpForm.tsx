"use client";

import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [server, setServer] = useState("");

  const [viewerPassword, setViewerPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [showViewerPassword, setShowViewerPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          tag,
          server: server ? Number(server) : null,
          viewerPassword,
          adminPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Unable to create alliance");
        return;
      }

      onSuccess?.();
    } catch {
      setError("Unable to create alliance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-center mb-6">
        Create Alliance
      </h2>

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

        <input
          type="number"
          value={server}
          onChange={(e) => setServer(e.target.value)}
          placeholder="Server"
          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
        />

        <div className="relative">
          <input
            type={showViewerPassword ? "text" : "password"}
            value={viewerPassword}
            onChange={(e) => setViewerPassword(e.target.value)}
            placeholder="Viewer Password"
            className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <button
            type="button"
            onClick={() => setShowViewerPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
          >
            {showViewerPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showAdminPassword ? "text" : "password"}
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin Password"
            className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <button
            type="button"
            onClick={() => setShowAdminPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
          >
            {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Alliance"}
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}
