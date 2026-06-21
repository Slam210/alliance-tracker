type Props = {
  weekName: string;
  currentIndex: number;
  totalWeeks: number;
  onChange: (index: number) => void;
};

export default function WeekSelector({
  weekName,
  currentIndex,
  totalWeeks,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        className="rounded border border-slate-700 px-3 py-2 disabled:opacity-40"
      >
        ◀
      </button>

      <h2 className="text-2xl font-bold">
        {weekName.replace("SR", "State Ruler ")}
      </h2>

      <button
        type="button"
        onClick={() => onChange(Math.min(totalWeeks - 1, currentIndex + 1))}
        disabled={currentIndex === totalWeeks - 1}
        className="rounded border border-slate-700 px-3 py-2 disabled:opacity-40"
      >
        ▶
      </button>
    </div>
  );
}
