import { useMemo, useState } from "react";

import type { Member } from "../../../types/member";
import type { EntryType } from "../../../types/week";

import SubmitText from "../../../components/SubmitText";

type BatchEntryRow = {
  id: string;
  name: string;

  entryType: EntryType | null;
  points: number | null;
  exception: boolean;
};

type Props = {
  open: boolean;
  members: Member[];
  selectedDate: Date | null;

  isSubmitting: boolean;
  isSunday: boolean;

  onClose: () => void;
  onSubmit: (
    entries: {
      id: string;
      name: string;
      entryType: EntryType;
      date: Date;
      points: number;
      exception: boolean;
    }[],
  ) => Promise<void>;
};

export default function BatchEditModal({
  open,
  members,
  selectedDate,
  isSubmitting,
  isSunday,
  onClose,
  onSubmit,
}: Props) {
  const entryOptions: EntryType[] = isSunday
    ? ["weekly_top", "general", "weekly_bottom"]
    : ["daily_top", "general", "daily_bottom"];

  const [rows, setRows] = useState<BatchEntryRow[]>([]);
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return [];

    const term = search.toLowerCase();

    return members
      .filter(
        (member) =>
          String(member.name.toLowerCase()).includes(term) ||
          (member.nickname &&
            String(member.nickname).toLowerCase().includes(term)),
      )
      .filter((member) => !rows.some((row) => row.id === member.id))
      .slice(0, 10);
  }, [members, rows, search]);

  const addMember = (member: Member) => {
    setRows((prev) => [
      ...prev,
      {
        id: member.id,
        name: member.nickname || member.name,
        entryType: null,
        points: null,
        exception: false,
      },
    ]);

    setSearch("");
  };

  const removeMember = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (id: string, updates: Partial<BatchEntryRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updates } : row)),
    );
  };

  const setAllType = (entryType: EntryType) => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        entryType,
      })),
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) return;

    const invalid = rows.some(
      (row) => !row.entryType || row.points === null || row.points < 0,
    );

    if (invalid) {
      alert("All members must have a type and points.");
      return;
    }

    await onSubmit(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        entryType: row.entryType!,
        date: selectedDate,
        points: row.points!,
        exception: row.exception,
      })),
    );

    setRows([]);
  };

  if (!open || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-2 sm:p-6">
      <div className="w-full sm:max-w-5xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white">
            Batch Alliance Duel Entry
          </h2>

          <div className="mt-2 text-sm text-slate-300">
            Date: {selectedDate.toDateString()}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member..."
              className="
                w-full
                rounded-xl
                bg-slate-800
                border
                border-white/10
                px-3
                py-2
                text-white
                "
            />

            {filteredMembers.length > 0 && (
              <div
                className="
                    absolute
                    z-20
                    mt-1
                    w-full
                    overflow-auto no-scrollbar
                    rounded-xl
                    border
                    border-white/10
                    bg-slate-900
                    shadow-xl
                "
              >
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => addMember(member)}
                    className="
                        block
                        w-full
                        px-3
                        py-2
                        text-left
                        text-white
                        hover:bg-slate-800
                        cursor-pointer
                    "
                  >
                    {member.nickname || member.name}
                    {" - "}
                    <span className="text-gray-300">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4 space-y-3">
            <div className="text-sm text-slate-400">Bulk Actions</div>

            <div className="flex flex-wrap gap-2">
              {entryOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => setAllType(type)}
                  className="
                    rounded-lg
                    bg-slate-700
                    px-3
                    py-2
                    text-sm
                    text-white
                    hover:bg-slate-600
                    cursor-pointer
                  "
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-white/10 overflow-auto no-scrollbar max-h-108">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-3 text-left text-slate-300">Member</th>

                  <th className="p-3 text-left text-slate-300">Type</th>

                  <th className="p-3 text-left text-slate-300">Points</th>

                  <th className="p-3 text-center text-slate-300">Exception</th>

                  <th className="p-3 text-center text-slate-300">Delete</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="p-3 text-white">{row.name}</td>

                    <td className="p-3">
                      <select
                        value={row.entryType ?? ""}
                        onChange={(e) =>
                          updateRow(row.id, {
                            entryType: e.target.value as EntryType,
                          })
                        }
                        className="
                          rounded-lg
                          bg-slate-800
                          border
                          border-white/10
                          px-2
                          py-1
                          text-white
                        "
                      >
                        <option value="">Select</option>

                        {entryOptions.map((type) => (
                          <option key={type} value={type}>
                            {type.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.points ?? ""}
                        onChange={(e) =>
                          updateRow(row.id, {
                            points: Number(e.target.value) || 0,
                          })
                        }
                        className="
                          w-36
                          rounded-lg
                          bg-slate-800
                          border
                          border-white/10
                          px-2
                          py-1
                          text-white
                        "
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.exception}
                        onChange={(e) =>
                          updateRow(row.id, {
                            exception: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeMember(row.id)}
                        className="
                        text-red-400
                        hover:text-red-300
                        cursor-pointerfmember
                        "
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 flex justify-end gap-2">
          <button
            onClick={() => {
              setRows([]);
              onClose();
            }}
            className="
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              hover:bg-red-500/70
              px-5
              py-2.5
              text-red-300
              cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              rounded-xl
              border
              border-green-500/20
              bg-green-500/10
              hover:bg-green-500/70
              px-5
              py-2.5
              text-green-300
              cursor-pointer
              disabled:opacity-50
            "
          >
            <SubmitText
              isSubmitting={isSubmitting}
              text={`Submit ${rows.length} Entries`}
              loadingText="Submitting..."
            />
          </button>
        </div>
      </div>
    </div>
  );
}
