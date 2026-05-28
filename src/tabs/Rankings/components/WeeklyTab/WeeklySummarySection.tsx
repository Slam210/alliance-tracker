import { useCallback, useState } from "react";
import { useWeeklySummaryText } from "../../hooks/useWeeklySummaryText";
import type { SpecialNotesByDay } from "../../../../types/derived/specialNotes";
import type { Week, DayKey } from "../../../../types/week";

type SummaryMode = "positive" | "negative";

type Props = {
  mode: SummaryMode;
  selectedWeek: Week;
  successNotes?: SpecialNotesByDay;
  failureNotes?: SpecialNotesByDay;
  risers?: SpecialNotesByDay;
  fallers?: SpecialNotesByDay;
  getDayLabel: (day: DayKey) => string;
};

export default function WeeklySummarySection({
  mode,
  selectedWeek,
  successNotes = {} as SpecialNotesByDay,
  failureNotes = {} as SpecialNotesByDay,
  risers = {} as SpecialNotesByDay,
  fallers = {} as SpecialNotesByDay,
  getDayLabel,
}: Props) {
  const textOutput = useWeeklySummaryText({
    mode,
    selectedWeek,
    successNotes,
    failureNotes,
    risers,
    fallers,
    getDayLabel,
  });

  const title = mode === "positive" ? "Positive Summary" : "Negative Summary";

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textOutput);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [textOutput]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden w-full">
      <div className="relative border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase text-white/90">
          {title}
        </h2>

        <button
          onClick={handleCopy}
          className="absolute right-3 top-2 p-2 text-white/70 hover:text-white transition"
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
