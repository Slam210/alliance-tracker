import { useEffect, useRef } from "react";
import type { Member } from "../../../types/member";
import type { EntryType } from "../../../types/week";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

type Props = {
  open: boolean;
  member: Member | null;
  selectedDate: Date | null;

  points: number | null;
  setPoints: (value: number) => void;

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

  // strict speech → number parser
  const parseTranscriptToNumber = (text: string): number | null => {
    if (!text) return null;

    const cleaned = text.toLowerCase().trim();

    // try raw numeric extraction first (fast path)
    const numericOnly = cleaned.replace(/[^0-9]/g, "");
    if (numericOnly) return Number(numericOnly);

    // fallback single-word numbers
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

    if (map[cleaned] !== undefined) {
      return map[cleaned];
    }

    return null;
  };

  // speech sync
  useEffect(() => {
    if (transcript === lastProcessedRef.current) return;

    lastProcessedRef.current = transcript;

    const number = parseTranscriptToNumber(transcript);

    if (number !== null) {
      setPoints(number);
    }
  }, [transcript, setPoints]);

  if (!open || !member || !selectedDate) return null;

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center text-white">
        Speech recognition is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50">
      <div className="bg-gray-800 w-full sm:w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-t-2xl sm:rounded-xl border border-gray-700 shadow-xl">
        {/* Header */}
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
            {member.name}
          </p>
        </div>

        {/* Entry Type */}
        <div className="mt-4 space-y-2">
          <label className="text-sm text-gray-400">Entry Type</label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {entryOptions.map((type) => (
              <button
                key={type}
                onClick={() => setEntryType(type)}
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

        {/* Points + Speech */}
        <div className="mt-4 space-y-2">
          <label className="text-sm text-gray-400">Enter Points</label>

          <div className="flex gap-2">
            <input
              type="number"
              value={points ?? currentPoints ?? ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPoints(val ? Number(val) : 0);
              }}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />

            <button
              type="button"
              onClick={() =>
                SpeechRecognition.startListening({ continuous: false })
              }
              className={`px-3 py-2 rounded text-white ${
                listening ? "bg-green-600" : "bg-gray-600"
              }`}
              title="Start voice input"
            >
              🎤
            </button>

            <button
              type="button"
              onClick={SpeechRecognition.stopListening}
              className="px-3 py-2 bg-red-600 rounded text-white"
              title="Stop"
            >
              ⏹
            </button>

            <button
              type="button"
              onClick={resetTranscript}
              className="px-3 py-2 bg-gray-500 rounded text-white"
              title="Reset speech"
            >
              ↺
            </button>
          </div>

          {/* optional debug (remove later if you want) */}
          {transcript && (
            <p className="text-xs text-gray-400 mt-1">Heard: {transcript}</p>
          )}
        </div>

        {/* Quick Add */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[100_000, 300_000, 500_000, 1_000_000, 3_000_000, 5_000_000].map(
            (val) => (
              <button
                key={val}
                onClick={() =>
                  setPoints(
                    Math.min((points ?? currentPoints ?? 0) + val, 18_000_000),
                  )
                }
                className="text-sm px-2 py-2 rounded bg-gray-700 hover:bg-blue-600 text-white"
              >
                +{val >= 1_000_000 ? `${val / 1_000_000}M` : `${val / 1000}k`}
              </button>
            ),
          )}
        </div>

        {/* Exception Toggle */}
        <div className="mt-4 bg-gray-700/60 border border-gray-600 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition">
          <div>
            <div className="text-sm font-medium text-white">
              Exception Status
            </div>

            <div className="text-xs text-gray-300 mt-1">
              {exception ? (
                <span className="text-green-400">EXEMPT ACTIVE</span>
              ) : (
                <span className="text-gray-400">No exception applied</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setException(!exception)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              exception ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                exception ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
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
  );
}
