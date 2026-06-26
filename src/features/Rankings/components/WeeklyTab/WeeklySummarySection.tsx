import { useCallback, useState } from "react";
import { useWeeklySummaryText } from "../../hooks/useWeeklySummaryText";
import type { SpecialNotesByDay } from "../../../../types/derived/specialNotes";
import type { Week, EventKey } from "../../../../types/week";
import type { SummaryMode } from "../../../../types/derived/summary";
import { AllianceSettings } from "../../../../types/settings";

type Props = {
  mode: SummaryMode;
  selectedWeek: Week;
  successNotes?: SpecialNotesByDay;
  failureNotes?: SpecialNotesByDay;
  risers?: SpecialNotesByDay;
  fallers?: SpecialNotesByDay;
  activeMemberIds: Set<string>;
  allianceSettings: AllianceSettings;
};

export default function WeeklySummarySection({
  mode,
  selectedWeek,
  successNotes = {} as SpecialNotesByDay,
  failureNotes = {} as SpecialNotesByDay,
  risers = {} as SpecialNotesByDay,
  fallers = {} as SpecialNotesByDay,
  activeMemberIds,
  allianceSettings
}: Props) {
  const textOutput = useWeeklySummaryText({
    mode,
    selectedWeek,
    successNotes,
    failureNotes,
    risers,
    fallers,
    activeMemberIds,
    allianceSettings
  });

  const title = mode === "positive" ? "Positive Summary" : "Negative Summary";

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(textOutput);
    }

    setCopied(true);

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [textOutput]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 overflow-auto no-scrollbar w-full">
      <div className="relative border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase text-white/90">
          {title}
        </h2>

        <button
          onClick={handleCopy}
          className="absolute right-3 top-2 p-2 text-white/70 hover:text-white transition cursor-pointer"
          aria-label="Copy to clipboard"
        >
          {copied ? "✔️" : "📋"}
        </button>
      </div>

      <div className="p-4">
        <pre className="w-full whitespace-pre-wrap rounded-xl bg-black/30 p-4 font-mono text-sm text-white/90">
          {textOutput}
        </pre>
      </div>
    </div>
  );
}
