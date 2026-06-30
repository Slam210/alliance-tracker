import { useAuth } from "../../../hooks/useAuth";

type Props = {
  date: string | null;
  minDate?: string;
  maxDate?: string;
  onChange: (date: string | null) => void;
};

export default function StateRulerDatePicker({
  date,
  minDate,
  maxDate,
  onChange,
}: Props) {
  const {role} = useAuth()
  return (
    <div className="mx-auto flex w-full justify-center items-center gap-3">
        <input
          type="date"
          value={date ?? ""}
          min={minDate}
          max={maxDate}
          onChange={(e) => onChange(role === "admin" ? e.target.value : null)}
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
