import { useState } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const PASSWORD = import.meta.env.VITE_APP_PASSWORD;

  if (authorized) return <>{children}</>;

  return (
    <div style={{ textAlign: "center", marginTop: 120 }}>
      <h2>Restricted Access</h2>

      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter password"
        style={{ padding: 8 }}
      />

      <button
        onClick={() => setAuthorized(input === PASSWORD)}
        style={{ marginLeft: 8 }}
      >
        Enter
      </button>

      {input && input !== PASSWORD && (
        <p style={{ color: "red" }}>Wrong password</p>
      )}
    </div>
  );
}
