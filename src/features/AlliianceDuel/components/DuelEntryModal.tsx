import { useEffect, useRef } from "react";
import type { Member } from "../../../types/member";
import type { EntryType } from "../../../types/week";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SubmitText from "../../../components/SubmitText";
import { formatInputNumber } from "../../../utils/formatNumbers";

type Props = {
  open: boolean;
  member: Member | null;
  selectedDate: Date | null;

  points: number | null;
  setPoints: (value: number | null) => void;

  entryType: EntryType | null;
  setEntryType: (value: EntryType) => void;

  exception: boolean;
  setException: (value: boolean) => void;

  isSubmitting: boolean;
  currentPoints: number | null;

  onClose: () => void;
  onSubmit: () => void;

  isSunday: boolean;
};

export default function DuelEntryModal({
  open,
  member,
  selectedDate,
  points,
  setPoints,
  entryType,
  setEntryType,
  exception,
  setException,
  isSubmitting,
  currentPoints,
  onClose,
  onSubmit,
  isSunday,
}: Props) {
  const entryOptions: EntryType[] = isSunday
    ? ["weekly_top", "general", "weekly_bottom"]
    : ["daily_top", "general", "daily_bottom"];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastProcessedRef = useRef("");

  const parseTranscriptToNumber = (text: string): number | null => {
    if (!text) return null;

    const cleaned = text.toLowerCase().trim();

    const numericOnly = cleaned.replace(/[^0-9]/g, "");
    if (numericOnly) return Number(numericOnly);

    const map: Record<string, number> = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };

    return map[cleaned] ?? null;
  };

  useEffect(() => {
    if (transcript === lastProcessedRef.current) return;

    lastProcessedRef.current = transcript;

    const number = parseTranscriptToNumber(transcript);
    if (number !== null) setPoints(number);
  }, [transcript, setPoints]);

  if (!open || !member || !selectedDate) return null;

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center text-white text-center px-6">
        Speech recognition is not supported in this browser.
      </div>
    );
  }

  const isDisabled = isSubmitting || points === null || points < 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-2 sm:p-6">
      {/* Modal */}
      <div className="w-full sm:max-w-2xl lg:max-w-3xl max-h-[80vh] my-auto overflow-y-auto no-scrollbar rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-white/10 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Alliance Duel Entry
          </h2>

          <div className="mt-2 text-sm text-slate-300 space-y-1">
            <p>
              <span className="text-white font-medium">Date:</span>{" "}
              {selectedDate.toDateString()}
            </p>
            <p>
              <span className="text-white font-medium">Member:</span>{" "}
              {member.nickname ? member.nickname : member.name}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Entry Type */}
          <section className="space-y-2">
            <h3 className="text-sm text-slate-400">Entry Type</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {entryOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => setEntryType(type)}
                  className={`rounded-xl px-3 py-2 text-xs sm:text-sm transition border cursor-pointer ${
                    type?.includes("top") && entryType?.includes("top")
                      ? "bg-blue-green/20 border-green-400 text-green-300"
                      : type?.includes("general") &&
                          entryType?.includes("general")
                        ? "bg-blue-blue/20 border-blue-400 text-blue-300"
                        : type?.includes("bottom") &&
                            entryType?.includes("bottom")
                          ? "bg-blue-red/20 border-red-400 text-red-300"
                          : "bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>
          </section>

          {/* Points */}
          <section className="space-y-2">
            <h3 className="text-sm text-slate-400">Points</h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={formatInputNumber(points ?? currentPoints ?? null)}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPoints(val ? Number(val) : 0);
                }}
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Voice Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    SpeechRecognition.startListening({ continuous: false })
                  }
                  className={`rounded-xl px-3 py-2 text-white transition cursor-pointer ${
                    listening
                      ? "bg-green-500"
                      : "bg-slate-700 hover:bg-green-600"
                  }`}
                  aria-label="Start"
                >
                  🎤
                </button>

                <button
                  onClick={SpeechRecognition.stopListening}
                  className="rounded-xl px-3 py-2 bg-slate-700 hover:bg-red-600  text-white cursor-pointer"
                  aria-label="Stop"
                >
                  ⏹
                </button>

                <button
                  onClick={() => {
                    resetTranscript();
                    SpeechRecognition.stopListening();
                    setPoints(null);
                  }}
                  className="rounded-xl px-3 py-2 bg-slate-700 hover:bg-blue-600 text-white cursor-pointer"
                  aria-label="Reset"
                >
                  ↺
                </button>
              </div>
            </div>

            {transcript && (
              <p className="text-xs text-slate-400">Heard: {transcript}</p>
            )}
          </section>

          {/* Quick Add */}
          <section className="space-y-2">
            <h3 className="text-sm text-slate-400">Quick Set</h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                0, 100_000, 250_000, 500_000, 750_000, 1_000_000, 1_500_000,
                2_000_000, 2_500_000, 3_000_000,
              ].map((val) => (
                <button
                  key={val}
                  onClick={() => setPoints(val)}
                  className="rounded-xl bg-slate-800 hover:bg-blue-500/20 text-white text-xs sm:text-sm py-2 transition border border-white/10 cursor-pointer"
                >
                  {val >= 1_000_000 ? `${val / 1_000_000}M` : `${val / 1000}k`}
                </button>
              ))}
            </div>
          </section>

          {/* Exception */}
          <section className="rounded-xl border border-white/10 bg-slate-800/50 p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-medium">
                Exception Status
              </div>

              <div className="text-xs text-slate-400 mt-1">
                {exception ? (
                  <span className="text-green-400">EXEMPT ACTIVE</span>
                ) : (
                  "No exception applied"
                )}
              </div>
            </div>

            <button
              onClick={() => setException(!exception)}
              className={`relative h-6 w-11 rounded-full transition cursor-pointer ${
                exception ? "bg-green-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition cursor-pointer ${
                  exception ? "translate-x-5" : ""
                }`}
              />
            </button>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              onClick={onClose}
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
              cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={isDisabled}
              className={`
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
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
              disabled:hover:bg-green-500/10
              disabled:hover:text-green-300
              `}
            >
              <SubmitText
                isSubmitting={isSubmitting}
                text="Submit"
                loadingText="Submitting..."
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
