import { useAuth } from "../../../hooks/useAuth";

type Props = {
  date: string | null;
  minDate?: string;
  maxDate?: string;
  onChange: (date: string | null) => void;
  startDate?: Date;
};

function toInputDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function StateRulerDatePicker({
  date,
  minDate,
  maxDate,
  onChange,
  startDate,
}: Props) {
  const { role } = useAuth();

  const computedMin =
    startDate ? toInputDate(new Date(startDate)) : minDate;

  const computedMax = maxDate;

  return (
    <div className="mx-auto flex w-full justify-center items-center gap-3">
      <input
        type="date"
        value={date ?? ""}
        min={computedMin}
        max={computedMax}
        onChange={(e) => {
          const value = e.target.value;

          if (role !== "admin") return;

          // extra safety: block invalid manual input
          if (computedMin && value < computedMin) return;
          if (computedMax && value > computedMax) return;

          onChange(value || null);
        }}
        onKeyDown={(e) => {
          // prevents typing override in some browsers
          e.preventDefault();
        }}
        className="dark:scheme-dark"
      />

      {date && role === "admin" && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600"
        >
          Clear
        </button>
      )}
    </div>
  );
}
