import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "../../../styles/calendar.scss";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
  useCalendarTodoContext,
} from "../../../utils/app_context/general";

const AddDate = () => {
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const { todos, updateTodos } = useTodoContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { calendarTodos, updateCalendarTodos } = useCalendarTodoContext();
  const [calendarTodoDate, setCalendarTodoDate] = useState<Date | null>(null);

  // Calculate the last date of the current year
  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // checks for calendar page task details
  const updatedSelectedDate = () => {
    calendarTodos.forEach((item) => {
      if (item.expected_date_of_completion !== "") {
        const [day, month, year] = item.expected_date_of_completion.split("/");

        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );

        setSelectedDate(date);
      }
    });
  };

  const handleSave = () => {
    if (calendarTodoDate && calendarTodoDate instanceof Date) {
      const updatedTodo = calendarTodos.map((item) => ({
        ...item,
        expected_date_of_completion:
          calendarTodoDate.toLocaleDateString("en-GB"),
      }));
      updateCalendarTodos(updatedTodo);
      trackScreenFunc("time");
    } else {
      const updatedTodos = todos.map((item) => ({
        ...item,
        expected_date_of_completion: selectedDate.toLocaleDateString("en-GB"),
      }));

      updateTodos(updatedTodos);
      trackScreenFunc("time");
    }
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  useEffect(() => {
    updatedSelectedDate();
  }, []);

  useEffect(() => {
    calendarTodos.map((item) => {
      if (item.expected_date_of_completion !== "") {
        setCalendarTodoDate(selectedDate);
      }
    });
  }, [selectedDate]);

  return (
    <div
      className={`w-full h-full text-[#8687E7] ${
        darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
      }`}
    >
      <Calendar
        className={`w-full border-none ${
          darkMode ? "text-white bg-[#363636]" : "text-black bg-[#bdbdbd]"
        }`}
        onChange={handleDateChange}
        value={selectedDate}
        maxDate={lastDateOfYear}
      />
      <div className="flex justify-center items-center">
        <button
          onClick={cancel}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddDate;
