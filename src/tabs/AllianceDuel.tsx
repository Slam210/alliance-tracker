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
    if (points === null || points <= 0) return;

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

  const getMemberDayPoints = useCallback(
    (memberId: string) => {
      if (!selectedDate) return null;

      const dayKey = getDayKey(selectedDate);

      for (let i = weeks.length - 1; i >= 0; i--) {
        const member = weeks[i].members.find((m) => m.id === memberId);
        const value = member?.values?.[dayKey];

        if (value != null) {
          return value;
        }
      }

      return null;
    },
    [selectedDate, weeks],
  );

  return (
    <div className="space-y-6 p-6">
      {/* Calendar (3/4 width centered) */}
      <div className="w-3/4 mx-auto bg-gray-800 p-4 rounded">
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
          // Add event labels inside tiles
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const label = EVENT_MAP[date.getDay()];

            return (
              <div
                className={`text-[10px] ${EVENT_COLOR[date.getDay()]} mt-1 text-center`}
              >
                {label}
              </div>
            );
          }}
        />{" "}
      </div>

      {/* Member Section (only after date selected) */}
      {selectedDate && (
        <div className="space-y-4 w-1/2 mx-auto">
          <h3 className="text-lg text-white">{selectedDate.toDateString()}</h3>

          {/* Search */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member..."
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />

            {/* Dropdown */}
            {search && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl z-50 border border-gray-700">
                {filteredMembers.length === 0 ? (
                  <div className="p-3 text-gray-400">No members found</div>
                ) : (
                  filteredMembers.map((m) => {
                    const dayPoints = getMemberDayPoints(m.id);

                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMember(m)}
                        className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-none flex justify-between items-center rounded border text-left"
                      >
                        <div>
                          <div className="text-white font-medium">{m.name}</div>
                          <div className="text-gray-400 text-sm">
                            {m.nickname || "No nickname"}
                          </div>
                        </div>
                        {/* RIGHT: points OR placeholder */}
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
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => {
              const dayPoints = getMemberDayPoints(member.id);

              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="flex justify-between items-center p-2 rounded border bg-gray-700 border-gray-600 hover:bg-gray-600 text-left"
                >
                  {/* LEFT: member info */}
                  <div>
                    <div className="font-bold text-white">{member.name}</div>
                    <div className="text-sm text-gray-300">
                      {member.nickname || "No nickname"}
                    </div>
                  </div>

                  {/* RIGHT: points OR placeholder */}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-5 border border-gray-700 shadow-xl z-51">
            <h2 className="text-xl font-semibold text-white">
              Alliance Duel Entry
            </h2>

            {/* Info */}
            <div className="text-gray-300 text-sm space-y-1">
              <p>
                <span className="text-white font-medium">Date:</span>{" "}
                {selectedDate.toDateString()}
              </p>
              <p>
                <span className="text-white font-medium">Member:</span>{" "}
                {selectedMember.name}
              </p>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Entry Type</label>

              <div className="grid grid-cols-3 gap-2">
                {isSunday ? (
                  <>
                    <button
                      onClick={() => setEntryType("weekly_top")}
                      className={`px-3 py-2 rounded-full text-xs text-nowrap transition ${
                        entryType === "weekly_top"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Weekly Top
                    </button>
                    <button
                      onClick={() => setEntryType("general")}
                      className={`px-3 py-2 rounded-full text-xs text-nowrap transition ${
                        entryType === "general"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      General
                    </button>

                    <button
                      onClick={() => setEntryType("weekly_bottom")}
                      className={`px-3 py-2 rounded-full text-xs text-nowrap transition ${
                        entryType === "weekly_bottom"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Weekly Bottom
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEntryType("daily_top")}
                      className={`px-3 py-2 rounded-full text-xs text-nowrap transition ${
                        entryType === "daily_top"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Daily Top
                    </button>
                    <button
                      onClick={() => setEntryType("general")}
                      className={`px-3 py-2 rounded-full text-xs text-nowrap transition ${
                        entryType === "general"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setEntryType("daily_bottom")}
                      className={`px-3 py-2 rounded-full text-xs text-nowrap transition ${
                        entryType === "daily_bottom"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Daily Bottom
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Points Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Enter Points</label>
              <input
                type="number"
                value={
                  points ? points : (getMemberDayPoints(selectedMember.id) ?? 0)
                }
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Range Selector */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Quick Select Range
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  100_000, 300_000, 500_000, 1_000_000, 3_000_000, 5_000_000,
                ].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setPoints((prev) =>
                        Math.min(
                          (prev
                            ? prev
                            : (getMemberDayPoints(selectedMember.id) ?? 0)) +
                            val,
                          18_000_000,
                        ),
                      )
                    }
                    className="text-sm px-3 py-2 rounded bg-gray-700 hover:bg-blue-600 transition text-white"
                  >
                    +
                    {val >= 1_000_000
                      ? `${val / 1_000_000}M`
                      : `${val / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setPoints(0);
                  setShowPopup(false);
                }}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || points === null || points <= 0}
                className={`px-4 py-2 rounded text-white transition ${
                  isSubmitting || points === null || points <= 0
                    ? "bg-gray-500 cursor-not-allowed"
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
