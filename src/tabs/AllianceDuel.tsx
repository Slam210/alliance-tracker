import { useCallback, useState } from "react";
import Calendar from "react-calendar";
import type { Member } from "../types/member";
import { submitAllianceDuel } from "../services/api";
import type { DayKey, Week } from "../types/week";

type Props = {
  members: Member[];
  weeks: Week[];
  updatePoints: () => Promise<void>;
};

// Event labels per weekday (0 = Sunday)
const EVENT_MAP: Record<number, string> = {
  0: "Weekly Calculation",
  1: "Mod Vehicle Boost",
  2: "Shelter Upgrade",
  3: "Age of Science",
  4: "Hero Progression",
  5: "Holistic Growth",
  6: "Enemy Buster",
};

const EVENT_COLOR: Record<number, string> = {
  0: "text-white",
  1: "text-blue-400",
  2: "text-green-400",
  3: "text-purple-400",
  4: "text-yellow-400",
  5: "text-pink-400",
  6: "text-red-400",
};

function getDayKey(date: Date): DayKey {
  const map: Record<number, DayKey> = {
    0: "Weekly",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  return map[date.getDay()];
}

export default function AllianceDuel({ members, weeks, updatePoints }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entryType, setEntryType] = useState<
    | "daily_top"
    | "daily_bottom"
    | "weekly_top"
    | "weekly_bottom"
    | "general"
    | null
  >(null);
  const isSunday = selectedDate?.getDay() === 0;

  // Filter (name + nickname)
  const filteredMembers = members.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      (m.nickname && m.nickname.toLowerCase().includes(term))
    );
  });

  function handleSelectMember(member: Member) {
    if (!selectedDate) return;
    setSelectedMember(member);
    setShowPopup(true);
    setSearch("");
  }

  const handleSubmit = async () => {
    if (!selectedMember || !selectedDate) return;
    if (!entryType) {
      alert("Please select an entry type");
      return;
    }
    if (points === null || points < 0) return;

    try {
      setIsSubmitting(true);

      await submitAllianceDuel({
        id: selectedMember.id,
        name: selectedMember.name,
        entryType: entryType,
        date: selectedDate,
        points,
      });

      // Reset UI after success
      setShowPopup(false);
      setPoints(0);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to submit duel:", err);
      alert("Failed to submit. Check console.");
    } finally {
      setIsSubmitting(false);
      void updatePoints();
    }
  };

  function getWeekSheetName(date: Date) {
    const START = new Date("2026-04-20");
    START.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const day = d.getDay();

    const adjustedDate = new Date(d);

    if (day === 0) {
      adjustedDate.setDate(adjustedDate.getDate() - 1);
    }

    const diffDays = Math.floor(
      (adjustedDate.getTime() - START.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return null;

    const week = Math.floor(diffDays / 7) + 1;
    return `W${week}`;
  }

  const getMemberDayPoints = useCallback(
    (memberId: string) => {
      if (!selectedDate) return null;

      const dayKey = getDayKey(selectedDate);
      const weekName = getWeekSheetName(selectedDate);

      const week = weeks.find((w) => w.week === weekName);
      if (!week) return null;

      const member = week.members.find((m) => m.id === memberId);

      return member?.values?.[dayKey] ?? null;
    },
    [selectedDate, weeks],
  );

  return (
    <div className="space-y-6 p-3 sm:p-6">
      {/* Calendar */}
      <div className="w-full max-w-4xl mx-auto bg-gray-800 p-3 sm:p-4 rounded">
        <Calendar
          value={selectedDate || null}
          onChange={(date) => {
            const newDate = date as Date;

            if (selectedDate && newDate.getTime() === selectedDate.getTime()) {
              setSelectedDate(null);
            } else {
              setSelectedDate(newDate);
            }
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const label = EVENT_MAP[date.getDay()];

            return (
              <div
                className={`text-[9px] sm:text-[10px] ${EVENT_COLOR[date.getDay()]} mt-1 text-center`}
              >
                {label}
              </div>
            );
          }}
        />
      </div>

      {/* Member Section */}
      {selectedDate && (
        <div className="space-y-4 w-full max-w-3xl mx-auto">
          <h3 className="text-base sm:text-lg text-white text-center sm:text-left">
            {selectedDate.toDateString()}
          </h3>

          {/* Search */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member..."
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />

            {search && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl z-50 border border-gray-700 max-h-60 overflow-auto">
                {filteredMembers.length === 0 ? (
                  <div className="p-3 text-gray-400">No members found</div>
                ) : (
                  filteredMembers.map((m) => {
                    const dayPoints = getMemberDayPoints(m.id);

                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMember(m)}
                        className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-none flex justify-between items-center"
                      >
                        <div>
                          <div className="text-white font-medium">{m.name}</div>
                          <div className="text-gray-400 text-sm">
                            {m.nickname || "No nickname"}
                          </div>
                        </div>

                        <div className="text-right">
                          {dayPoints != null ? (
                            <div className="text-green-400 font-bold">
                              {dayPoints.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">—</div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Member Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {members.map((member) => {
              const dayPoints = getMemberDayPoints(member.id);

              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="flex justify-between items-center p-3 rounded border bg-gray-700 border-gray-600 hover:bg-gray-600 text-left"
                >
                  <div>
                    <div className="font-bold text-white">{member.name}</div>
                    <div className="text-sm text-gray-300">
                      {member.nickname || "No nickname"}
                    </div>
                  </div>

                  <div className="text-right">
                    {dayPoints != null ? (
                      <div className="text-green-400 font-bold">
                        {dayPoints.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">—</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && selectedMember && selectedDate && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50">
          <div
            className="
        bg-gray-800
        w-full sm:w-md
        max-h-[90vh]
        overflow-y-auto
        p-4 sm:p-6
        rounded-t-2xl sm:rounded-xl
        border border-gray-700
        shadow-xl
      "
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Alliance Duel Entry
            </h2>

            {/* Info */}
            <div className="text-gray-300 text-sm space-y-1 mt-3">
              <p>
                <span className="text-white font-medium">Date:</span>{" "}
                {selectedDate.toDateString()}
              </p>
              <p>
                <span className="text-white font-medium">Member:</span>{" "}
                {selectedMember.name}
              </p>
            </div>

            {/* Entry Type */}
            <div className="mt-4 space-y-2">
              <label className="text-sm text-gray-400">Entry Type</label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(isSunday
                  ? ["weekly_top", "general", "weekly_bottom"]
                  : ["daily_top", "general", "daily_bottom"]
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setEntryType(
                        type as
                          | "daily_top"
                          | "daily_bottom"
                          | "weekly_top"
                          | "weekly_bottom"
                          | "general",
                      )
                    }
                    className={`px-2 py-2 rounded text-xs transition ${
                      entryType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Points */}
            <div className="mt-4 space-y-2">
              <label className="text-sm text-gray-400">Enter Points</label>
              <input
                type="number"
                value={
                  points !== undefined && points !== null
                    ? points
                    : (getMemberDayPoints(selectedMember.id) ?? "")
                }
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>

            {/* Quick Add */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[100_000, 300_000, 500_000, 1_000_000, 3_000_000, 5_000_000].map(
                (val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setPoints((prev) =>
                        Math.min(
                          (prev ?? getMemberDayPoints(selectedMember.id) ?? 0) +
                            val,
                          18_000_000,
                        ),
                      )
                    }
                    className="text-sm px-2 py-2 rounded bg-gray-700 hover:bg-blue-600 text-white"
                  >
                    +
                    {val >= 1_000_000
                      ? `${val / 1_000_000}M`
                      : `${val / 1000}k`}
                  </button>
                ),
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setPoints(0);
                  setShowPopup(false);
                }}
                className="px-4 py-2 bg-gray-600 rounded text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || points === null || points < 0}
                className={`px-4 py-2 rounded text-white ${
                  isSubmitting || points === null || points < 0
                    ? "bg-gray-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
