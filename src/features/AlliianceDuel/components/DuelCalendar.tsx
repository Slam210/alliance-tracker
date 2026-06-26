import Calendar from "react-calendar";
import { EVENT_COLOR, EVENT_MAP } from "../constants/event";
import { getAllianceEventIndex } from "../../../constants/week";

type Props = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DuelCalendar({
  selectedDate,
  setSelectedDate,
  setCalendarOpen,
}: Props) {
  return (
    <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 p-2 sm:p-4 shadow-xl">
      <Calendar
        value={selectedDate}
        onChange={(value) => {
          const newDate = value as Date | null;
          if (!newDate) return;

          const isSame =
            selectedDate && newDate.getTime() === selectedDate.getTime();

          if (isSame) {
            setSelectedDate(null);
            return;
          }

          setSelectedDate(newDate);
          setCalendarOpen(false);
        }}
        className="custom-calendar"
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const idx = getAllianceEventIndex(date);

          return (
            <div
              className={`hidden sm:block text-center text-xs mt-1 ${
                EVENT_COLOR[idx]
              }`}
            >
              {EVENT_MAP[idx]}
            </div>
          );
        }}
      />
    </div>
  );
}
