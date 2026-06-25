type Props = {
  allianceId: string;
  name: string;
  setName: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  server: number | "";
  setServer: (value: number | "") => void;
  viewerPassword: string;
  setViewerPassword: (value: string) => void;
  adminPassword: string;
  setAdminPassword: (value: string) => void;
};

export default function AllianceDetailsCard({
  name,
  setName,
  tag,
  setTag,
  server,
  setServer,
  viewerPassword,
  setViewerPassword,
  adminPassword,
  setAdminPassword,
}: Props) {
  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Alliance Information
        </h2>

        <p className="text-sm text-slate-400">
          Manage alliance details and access passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Server</label>

          <input
            type="number"
            value={server}
            onChange={(e) =>
              setServer(e.target.value === "" ? "" : Number(e.target.value))
            }
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Alliance Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Alliance Tag
          </label>

          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-white font-medium mb-4">Update Passwords</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Viewer Password
            </label>

            <input
              type="password"
              value={viewerPassword}
              onChange={(e) => setViewerPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Admin Password
            </label>

            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
