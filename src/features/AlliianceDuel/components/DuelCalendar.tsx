import Calendar from "react-calendar";
import { EVENT_COLOR, EVENT_MAP } from "../constants/event";
import { getAllianceEventIndex } from "../../../constants/week";

type Props = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
};

export default function DuelCalendar({
  selectedDate,
  setSelectedDate,
  setCalendarOpen,
  startDate,
}: Props) {
  const minDate = new Date(startDate);
  minDate.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 p-2 sm:p-4 shadow-xl">
      <Calendar
        value={selectedDate}
        minDate={minDate}
        tileDisabled={({ date }) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d < minDate;
        }}
        onChange={(value) => {
          const newDate = value as Date | null;
          if (!newDate) return;

          const isSame =
            selectedDate &&
            newDate.getTime() === selectedDate.getTime();

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

          const d = new Date(date);
          d.setHours(0, 0, 0, 0);

          // Don't show event labels on disabled dates
          if (d < minDate) return null;

          const idx = getAllianceEventIndex(date, startDate);

          return (
            <div
              className={`hidden sm:block text-center text-xs mt-1 ${EVENT_COLOR[idx]}`}
            >
              {EVENT_MAP[idx]}
            </div>
          );
        }}
      />
    </div>
  );
}
