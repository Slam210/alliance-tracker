import Calendar from "react-calendar";
import { EVENT_COLOR, EVENT_MAP } from "../constants";

type Props = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
};

export default function DuelCalendar({ selectedDate, setSelectedDate }: Props) {
  return (
    <Calendar
      value={selectedDate}
      onChange={(date) => {
        const newDate = date as Date;

        if (selectedDate && newDate.getTime() === selectedDate.getTime()) {
          setSelectedDate(null);
        } else {
          setSelectedDate(newDate);
        }
      }}
      tileContent={({ date, view }) => {
        if (view !== "month") return null;

        return (
          <div
            className={`text-[9px] sm:text-[10px] ${
              EVENT_COLOR[date.getDay()]
            } mt-1 text-center`}
          >
            {EVENT_MAP[date.getDay()]}
          </div>
        );
      }}
    />
  );
}
