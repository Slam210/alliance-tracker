import { useMemo, useState } from "react";
import type { Member } from "../../types/member";
import type {
  StateRulerResponse,
  StateRulerWeek,
} from "../../types/stateRuler";
import { useStateRulerActions } from "./hooks/useStateRulerActions";
import SubmitText from "../../components/SubmitText";
import { formatNumber } from "../Rankings/utils/numbers";

type Props = {
  members: Member[];
  stateRulerData: StateRulerResponse;
  loadMembers: () => Promise<void>;
};

export default function StateRuler({
  members,
  stateRulerData,
  loadMembers,
}: Props) {
  const { isSaving, handleAddStateRulerData } = useStateRulerActions({
    reloadMembers: loadMembers,
  });
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "Active"),
    [members],
  );

  const initialWeeks = useMemo<StateRulerWeek[]>(() => {
    const existingWeeks = Object.entries(stateRulerData)
      .map(([name, rows]) => ({
        name,
        rows: activeMembers.map((member) => {
          const existing = rows.find((r) => r.id === member.id);

          return (
            existing ?? {
              id: member.id,
              name: member.name,
              progressRank: null,
              progressScore: null,
              clashRank: null,
              clashScore: null,
              lastUpdated: null,
            }
          );
        }),
      }))
      .filter((w) => {
        const num = Number(w.name.replace("SR", ""));
        return num >= 3;
      })
      .sort(
        (a, b) =>
          Number(a.name.replace("SR", "")) - Number(b.name.replace("SR", "")),
      );

    const highestWeek =
      existingWeeks.length > 0
        ? Math.max(
            ...existingWeeks.map((w) => Number(w.name.replace("SR", ""))),
          )
        : 2;

    const nextWeek: StateRulerWeek = {
      name: `SR${highestWeek + 1}`,
      rows: activeMembers.map((member) => ({
        id: member.id,
        name: member.name,
        progressRank: null,
        progressScore: null,
        clashRank: null,
        clashScore: null,
        lastUpdated: null,
      })),
    };

    return [...existingWeeks, nextWeek];
  }, [stateRulerData, activeMembers]);

  const [weeks, setWeeks] = useState<StateRulerWeek[]>(initialWeeks);

  const [entryType, setEntryType] = useState<"progress" | "clash" | "both">(
    "both",
  );

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(
    initialWeeks.length - 1,
  );

  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const currentWeek = weeks[selectedWeekIndex];

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase();

    return activeMembers.filter((member) => {
      const name = String(
        member.nickname ? member.nickname : member.name,
      ).toLowerCase();

      return name.includes(query);
    });
  }, [activeMembers, search]);

  const selectedMember = activeMembers.find(
    (member) => member.id === selectedMemberId,
  );

  const [selectedRow, setSelectedRow] = useState<
    StateRulerWeek["rows"][number] | null
  >(null);

  const handleCancel = () => {
    setSelectedRow(null);
    setSelectedMemberId(null);
    setEntryType("both");
  };

  const handleSubmit = async () => {
    if (!selectedMember || !selectedRow) return;

    try {
      await handleAddStateRulerData(
        selectedMember.id,
        selectedMember.name,
        entryType,
        currentWeek.name,
        entryType === "progress" || entryType === "both"
          ? (selectedRow.progressRank ?? undefined)
          : undefined,
        entryType === "progress" || entryType === "both"
          ? (selectedRow.progressScore ?? undefined)
          : undefined,
        entryType === "clash" || entryType === "both"
          ? (selectedRow.clashRank ?? undefined)
          : undefined,
        entryType === "clash" || entryType === "both"
          ? (selectedRow.clashScore ?? undefined)
          : undefined,
      );
      setWeeks((prev) =>
        prev.map((week, weekIndex) => {
          if (weekIndex !== selectedWeekIndex) return week;

          return {
            ...week,
            rows: week.rows.map((row) =>
              row.id === selectedMember.id
                ? {
                    ...row,
                    progressRank:
                      entryType === "progress" || entryType === "both"
                        ? selectedRow.progressRank
                        : row.progressRank,
                    progressScore:
                      entryType === "progress" || entryType === "both"
                        ? selectedRow.progressScore
                        : row.progressScore,
                    clashRank:
                      entryType === "clash" || entryType === "both"
                        ? selectedRow.clashRank
                        : row.clashRank,
                    clashScore:
                      entryType === "clash" || entryType === "both"
                        ? selectedRow.clashScore
                        : row.clashScore,
                    lastUpdated: new Date().toISOString(),
                  }
                : row,
            ),
          };
        }),
      );
      setSelectedMemberId(null);
      setEntryType("both");
      setSearch("");
    } catch (error) {
      console.error("Failed to save state ruler entry", error);
    }
  };

  return (
    <div className="space-y-6 p-4 text-white">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
          disabled={selectedWeekIndex === 0}
          className="rounded border border-slate-700 px-3 py-2 disabled:opacity-40"
        >
          ◀
        </button>

        <h2 className="text-2xl font-bold">
          {currentWeek?.name.replace("SR", "State Ruler ")}
        </h2>

        <button
          type="button"
          onClick={() =>
            setSelectedWeekIndex((prev) => Math.min(weeks.length - 1, prev + 1))
          }
          disabled={selectedWeekIndex === weeks.length - 1}
          className="rounded border border-slate-700 px-3 py-2 disabled:opacity-40"
        >
          ▶
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member..."
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredMembers.map((member) => {
          const row = currentWeek?.rows.find((r) => r.id === member.id);

          const completed =
            row?.progressRank != null ||
            row?.progressScore != null ||
            row?.clashRank != null ||
            row?.clashScore != null;

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => {
                const row = currentWeek.rows.find((r) => r.id === member.id);

                setSelectedMemberId(member.id);
                setSelectedRow(
                  row
                    ? { ...row }
                    : {
                        id: member.id,
                        name: member.name,
                        progressRank: null,
                        progressScore: null,
                        clashRank: null,
                        clashScore: null,
                        lastUpdated: null,
                      },
                );
              }}
              className={`rounded-lg border p-4 text-left transition hover:bg-slate-800 ${
                completed ? "border-green-500" : "border-slate-700"
              }`}
            >
              <div className="font-medium">
                {member.nickname ? member.nickname : member.name}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {row ? (
                  <div className="space-y-1">
                    {(row.progressRank || row.progressScore) && (
                      <div>
                        P: #{row.progressRank ?? "-"} •{" "}
                        {formatNumber(row.progressScore ?? 0).toLocaleString()}
                      </div>
                    )}

                    {(row.clashRank || row.clashScore) && (
                      <div>
                        C: #{row.clashRank ?? "-"} •{" "}
                        {formatNumber(row.clashScore ?? 0).toLocaleString()}
                      </div>
                    )}

                    {!completed && "No data entered"}
                  </div>
                ) : (
                  "No data entered"
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedMember && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/70 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    State Ruler Entry
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {currentWeek.name} •{" "}
                    {selectedMember.nickname || selectedMember.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMemberId(null)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 m-4">
              <div className="grid grid-cols-3">
                <button
                  type="button"
                  onClick={() => setEntryType("progress")}
                  className={`rounded-l-xl pl-3 text-sm font-medium transition ${
                    entryType === "progress"
                      ? "bg-green-600 text-white"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Progress
                </button>

                <button
                  type="button"
                  onClick={() => setEntryType("both")}
                  className={`py-2 text-sm font-medium transition ${
                    entryType === "both"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Both
                </button>

                <button
                  type="button"
                  onClick={() => setEntryType("clash")}
                  className={`rounded-r-xl pr-3 py-2 text-sm font-medium transition ${
                    entryType === "clash"
                      ? "bg-red-600 text-white"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Clash
                </button>
              </div>
            </div>

            <div className="space-y-2 p-6">
              {/* Progress Section */}
              {(entryType === "progress" || entryType === "both") && (
                <div>
                  <h3 className="mb-3 border-b border-slate-700 pb-2 text-sm font-semibold uppercase tracking-wider text-green-400">
                    State Progress
                  </h3>

                  <div className="gap-4">
                    <div className="">
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Rank
                      </label>

                      <input
                        type="number"
                        value={selectedRow?.progressRank ?? ""}
                        onChange={(e) =>
                          setSelectedRow((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  progressRank:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-green-500 mb-2"
                        placeholder="Enter rank"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Score
                      </label>

                      <input
                        type="number"
                        value={selectedRow.progressScore ?? ""}
                        onChange={(e) =>
                          setSelectedRow((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  progressScore:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-green-500 mb-2"
                        placeholder="Enter score"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Clash Section */}
              {(entryType === "clash" || entryType === "both") && (
                <div>
                  <h3 className="mb-3 border-b border-red-700 pb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                    Capital Clash
                  </h3>

                  <div className="gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Rank
                      </label>

                      <input
                        type="number"
                        value={selectedRow.clashRank ?? ""}
                        onChange={(e) =>
                          setSelectedRow((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  clashRank:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-red-500"
                        placeholder="Enter rank"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Score
                      </label>

                      <input
                        type="number"
                        value={selectedRow.clashScore ?? ""}
                        onChange={(e) =>
                          setSelectedRow((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  clashScore:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-red-500"
                        placeholder="Enter score"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-800/50 px-6 py-4">
              <button
                type="button"
                onClick={handleCancel}
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
              disabled:opacity-50
              disabled:cursor-not-allowed
              cursor-pointer
              flex items-center justify-center gap-2
              min-w-28
            "
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSaving}
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
                  isSubmitting={isSaving}
                  text="Save"
                  loadingText="Saving..."
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
