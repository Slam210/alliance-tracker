import { useMemo, useState } from "react";
import timezones from "../../../data/static/timezones.json";
import type { TimezoneGroup } from "../../../types/timezones";
import SubmitText from "../../../components/SubmitText";

type Props = {
  newName: string;
  newNickname: string;
  timezone: string;
  display_name: string;
  setNewName: (value: string) => void;
  setNewNickname: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  setTimezone: (value: string) => void;
  setDisplayName: (value: string) => void;
  isLoading: boolean;
};

export default function EditMemberForm({
  newName,
  newNickname,
  timezone,
  display_name,
  setNewName,
  setNewNickname,
  onSave,
  onCancel,
  setTimezone,
  setDisplayName,
  isLoading,
}: Props) {
  const [tzQuery, setTzQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [openTz, setOpenTz] = useState(false);
  const [openName, setOpenName] = useState(false);

  // flatten timezone JSON into searchable list
  const timezoneList = useMemo(() => {
    return Object.values(timezones).flatMap((group: TimezoneGroup) =>
      group.zoneIds.map((id: string) => ({
        id,
        display_name: group.display_name,
      })),
    );
  }, []);

  function handleTimezoneSelect(id: string) {
    setTimezone(id);

    const match = timezoneList.find((t) => t.id === id);
    if (match) {
      setDisplayName(match.display_name);
    }

    setOpenTz(false);
  }

  const filteredTimezones = timezoneList.filter((tz) =>
    tz.id.toLowerCase().includes(tzQuery.toLowerCase()),
  );

  const filteredDisplayNames = Array.from(
    new Set(timezoneList.map((t) => t.display_name)),
  ).filter((name) => name.toLowerCase().includes(nameQuery.toLowerCase()));

  function handleDisplayNameSelect(name: string) {
    setDisplayName(name);
    setOpenName(false);
  }

  return (
    <div
      className="
        mx-auto w-full max-w-7xl rounded-2xl border border-white/10
        bg-linear-to-br from-slate-800/90 to-slate-900/90
        p-4 sm:p-5 lg:p-6 shadow-lg
      "
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Edit Member</h2>
          <p className="mt-1 text-sm text-slate-400">
            Update the member's name, nickname, and timezone.
          </p>
        </div>

        {/* NAME FIELDS */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Name
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Nickname
            </label>
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white"
            />
          </div>
        </div>

        {/* TIMEZONE ID SEARCH */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Timezone ID
          </label>

          <input
            value={timezone}
            onChange={(e) => {
              setTimezone(e.target.value);
              setTzQuery(e.target.value);
              setOpenTz(true);
            }}
            placeholder="Search timezone (e.g. America/Los_Angeles)"
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white"
          />

          {openTz && tzQuery && (
            <div className="mt-2 max-h-40 overflow-auto rounded-xl border border-white/10 bg-slate-950">
              {filteredTimezones.slice(0, 8).map((tz) => (
                <button
                  key={tz.id}
                  onClick={() => handleTimezoneSelect(tz.id)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                >
                  {tz.id}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DISPLAY NAME SEARCH */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Display Name
          </label>

          <input
            value={display_name}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setNameQuery(e.target.value);
              setOpenName(true);
            }}
            placeholder="Search display name (e.g. Pacific Time)"
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white"
          />

          {openName && nameQuery && (
            <div className="mt-2 max-h-40 overflow-auto rounded-xl border border-white/10 bg-slate-950">
              {filteredDisplayNames.slice(0, 8).map((name) => (
                <button
                  key={name}
                  onClick={() => handleDisplayNameSelect(name)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-5
              py-2.5
              text-sm
              font-medium
              text-red-300
              transition
              hover:bg-red-500
              hover:text-black
              cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={isLoading}
            className="
              rounded-xl
              border
              border-green-500/20
              bg-green-500/10
              px-5
              py-2.5
              text-sm
              font-medium
              text-green-300
              transition
              hover:bg-green-500
              hover:text-black
              disabled:opacity-50
              disabled:cursor-not-allowed
              cursor-pointer
              flex items-center justify-center gap-2
              min-w-28
            "
          >
            <SubmitText
              isSubmitting={isLoading}
              text="Update"
              loadingText="Updating..."
            />
          </button>
        </div>
      </div>
    </div>
  );
}
