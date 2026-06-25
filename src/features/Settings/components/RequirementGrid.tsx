import { EVENT_MAP } from "../../Rankings/constants/eventMap";
import { DAYS } from "../../Rankings/constants/days";
import {
  formatInputNumber,
  parseFormattedNumber,
} from "../../../utils/formatNumbers";

type RequirementMode = "unified" | "custom";

type Props = {
  title: string;
  mode: RequirementMode;
  onModeChange: (mode: RequirementMode) => void;
  values: (number | "")[];
  onChange: (index: number, value: number | "") => void;
};

export default function RequirementGrid({
  title,
  mode,
  onModeChange,
  values,
  onChange,
}: Props) {
  const handleChange = (index: number, raw: string) => {
    if (raw === "") {
      onChange(index, "");
      return;
    }

    const parsed = Number(parseFormattedNumber(raw));

    if (Number.isNaN(parsed)) return;

    onChange(index, parsed);
  };

  const getLabel = (day: (typeof DAYS)[number]) => EVENT_MAP[day];

  const isEndGame = title.toLowerCase().includes("end game");

  const dailyPlaceholder = isEndGame ? "e.g. 3,000,000" : "e.g. 400,000";
  const weeklyPlaceholder = isEndGame ? "e.g. 18,000,000" : "e.g. 3,000,000";

  const accent =
    mode === "unified"
      ? "focus:ring-indigo-500 focus:border-indigo-500"
      : "focus:ring-yellow-500 focus:border-yellow-500";

  const baseInput =
    "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white transition focus:outline-none focus:ring-2 " +
    accent;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-5">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>

          <p className="text-sm text-slate-400">
            Configure requirement values and scaling behavior.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* MODE */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => onModeChange("unified")}
              className={`px-3 py-2 text-sm rounded-lg transition ${
                mode === "unified"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Unified
            </button>

            <button
              onClick={() => onModeChange("custom")}
              className={`px-3 py-2 text-sm rounded-lg transition ${
                mode === "custom"
                  ? "bg-yellow-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* VALUES */}
      {mode === "unified" ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 hover:border-slate-700 transition">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                {title} (Mon–Sat)
              </label>

              <p className="text-xs text-slate-500">
                Applies to: Mod Vehicle Boost – Enemy Buster
              </p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={formatInputNumber(values[0] !== "" ? values[0] : null)}
              onChange={(e) => handleChange(0, e.target.value)}
              placeholder={dailyPlaceholder}
              className={baseInput}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              {title} ({getLabel("Weekly")})
            </label>

            <p className="text-xs text-slate-500">Weekly completion target</p>

            <input
              type="text"
              inputMode="numeric"
              value={formatInputNumber(values[6] !== "" ? values[6] : null)}
              onChange={(e) => handleChange(6, e.target.value)}
              placeholder={weeklyPlaceholder}
              className={baseInput}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {DAYS.map((day, idx) => (
            <div
              key={day}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 hover:border-slate-700 transition"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  {getLabel(day)}
                </label>

                <p className="text-xs text-slate-500">{day}</p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={formatInputNumber(
                  values[idx] !== "" ? values[idx] : null,
                )}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder={
                  day === "Weekly" ? weeklyPlaceholder : dailyPlaceholder
                }
                className={baseInput}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
