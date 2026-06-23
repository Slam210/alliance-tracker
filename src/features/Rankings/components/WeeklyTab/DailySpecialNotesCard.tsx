import { getMemberNickname } from "../../../../data/cache/memberIndex";
import {
  toneStyles,
  typeStyles,
  type SpecialNoteEntry,
} from "../../../../types/derived/specialNotes";
import type { FilterType } from "./SpecialNotesSection";

type Props = {
  title: string;
  entries: SpecialNoteEntry[];
  tone: "top" | "bottom";
  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
  selectedFilter: FilterType;
};

export default function DailySpecialNotesCard({
  title,
  entries,
  tone,
  focusedMembers,
  onToggleMember,
  selectedFilter,
}: Props) {
  return (
    <div
      className={`min-w-72 relative rounded-2xl bg-gray-950 shadow-lg border ${
        toneStyles[tone].border
      }`}
    >
      {/* header glow */}
      <div
        className={`h-1 bg-linear-to-r ${toneStyles[tone].glow} rounded-t-2xl`}
      />

      {/* title */}
      <div className="p-3 text-center">
        <div className="text-sm font-semibold text-gray-200">{title}</div>
      </div>

      <div className="border-t border-gray-800" />

      {/* entries */}
      <div className="p-3 space-y-3 text-sm">
        {entries.length ? (
          entries.slice(0, tone === "top" ? 10 : 100).map((entry) => {
            const shouldHide =
              (selectedFilter === null &&
                tone === "bottom" &&
                entry.type === "first_time") ||
              (selectedFilter !== null && entry.type !== selectedFilter);

            if (shouldHide) return null;

            const isFocused =
              focusedMembers.size === 0 || focusedMembers.has(entry.id);
            const nickname = getMemberNickname(entry.id);

            return (
              <div
                key={`${entry.type}-${entry.id}`}
                onClick={() => onToggleMember(entry.id)}
                className={`
                    border-b border-gray-800 pb-2 last:border-none
                    cursor-pointer

                    hover:scale-105
                    hover:shadow-md hover:shadow-black/40

                    ${isFocused ? "opacity-100" : "opacity-30 text-gray-500"}
                `}
              >
                {/* top row */}
                <div className="flex justify-between items-start">
                  <span className={typeStyles[entry.type][tone].text}>
                    {nickname ? nickname : entry.name}
                  </span>
                  <span className="text-gray-300 tabular-nums font-semibold">
                    {entry.currentScore.toLocaleString()}
                  </span>
                </div>

                {/* type badge */}
                {entry.type !== "riser" && entry.type !== "faller" && (
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${
                        typeStyles[entry.type][tone].badge
                      }`}
                    >
                      {entry.type === "first_time" && "First Appearance"}

                      {entry.type === "reappearance" && "Returned"}

                      {entry.type === "recurring" && "Recurring"}
                    </span>
                  </div>
                )}

                <div
                  className={`mt-1 space-y-0.5 text-xs ${typeStyles[entry?.type][tone].detail}`}
                >
                  {entry.type === "reappearance" && (
                    <>
                      <div>Last seen: {entry.previousWeek}</div>
                      <div>{entry.totalAppearances} appearances</div>
                    </>
                  )}

                  {entry.type === "recurring" && (
                    <>
                      <div>{entry.streak} week streak</div>
                      {entry.streak !== entry.totalAppearances && (
                        <div>{entry.totalAppearances} appearances</div>
                      )}
                    </>
                  )}

                  {entry.type === "first_time" && (
                    <div>First recorded appearance</div>
                  )}
                </div>

                {entry.previousScore != null && (
                  <div
                    className={`text-xs mt-1 ${typeStyles[entry.type][tone].detail}`}
                  >
                    Previous: {entry.previousScore.toLocaleString()}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-xs text-gray-500 py-6">
            No special notes
          </div>
        )}
      </div>
    </div>
  );
}
