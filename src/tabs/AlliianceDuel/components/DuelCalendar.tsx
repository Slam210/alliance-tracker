import Calendar from "react-calendar";
import { EVENT_COLOR, EVENT_MAP } from "../constants";

type Props = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
};

export default function DuelCalendar({ selectedDate, setSelectedDate }: Props) {
  return (
    <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 p-2 sm:p-4 shadow-xl">
      <Calendar
        value={selectedDate}
        onChange={(date) => {
          const newDate = date as Date;
          if (!newDate) return;

          const isSame =
            selectedDate && newDate.getTime() === selectedDate.getTime();

          if (isSame) {
            setSelectedDate(null);
            return;
          }

          setSelectedDate(newDate);
        }}
        className="custom-calendar"
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          return (
            <div
              className={`hidden sm:block text-[8px] md:text-sm lg:text-md mt-1 text-center ${
                EVENT_COLOR[date.getDay()]
              }`}
            >
              {EVENT_MAP[date.getDay()]}
            </div>
          );
        }}
      />
    </div>
  );
}
