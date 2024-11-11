"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  useState,
  MouseEvent,
  createContext,
  useEffect,
  useRef,
  useTransition,
  useMemo,
} from "react";
import IconButton from "./icon-button";
import Button from "./button";
import { date2str, num2str, wildCard } from "./util";

const dayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const,
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

function nextMonth(date: Date) {
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];
  return new Date(
    `${month + 1 > 12 ? year + 1 : year}-${month + 1 > 12 ? 1 : month + 1}-1`,
  );
}

function previousMonth(date: Date) {
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];
  return new Date(
    `${month - 1 < 1 ? year - 1 : year}-${month - 1 < 1 ? 12 : month - 1}-1`,
  );
}

function startOfMonth(date: Date) {
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];
  return new Date(`${year}-${month}-1`);
}

function endOfMonth(date: Date) {
  const d = new Date();
  d.setTime(nextMonth(date).getTime() - 1);
  return d;
}

function isPickedDate(date: Date, y: number, m: number, d: number) {
  if (!date) return false;
  if (date.getFullYear() !== y) return false;
  if (date.getMonth() + 1 !== m) return false;
  if (date.getDate() !== d) return false;
  return true;
}

function isToday(y: number, m: number, d: number) {
  const date = new Date();
  if (date.getFullYear() !== y) return false;
  if (date.getMonth() + 1 !== m) return false;
  if (date.getDate() !== d) return false;
  return true;
}

function toValue(y: number, m: number, d: number) {
  return `${y}-${num2str(m)}-${num2str(d)}`;
}

export const CalendarContext = createContext<{
  showModal: (date?: Date | string) => void;
  close: () => void;
  onClose: (date?: Date) => any;
}>({
  showModal() {},
  close() {},
  onClose() {},
});

export default function CalendarModal(props: { children: React.ReactNode }) {
  const [date, setDate] = useState(new Date());
  const ref = useRef<HTMLDialogElement>(null);
  const constant = useRef<{
    cb: (date?: Date) => any;
    initial?: Date;
  }>({ cb(date?: Date) {}, initial: undefined });
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const dialog = ref.current;
    if (dialog) {
      dialog.onclose = (e) => {
        const str = ref.current?.returnValue;
        if (str) {
          if (str !== "false") constant.current.cb(new Date(str));
          else constant.current.cb(constant.current.initial);
        }
      };
    }
  }, []);

  function showModal(date?: Date | string) {
    constant.current.initial = undefined;
    startTransition(() => {
      if (typeof date === "string") date = new Date(date);
      if (date !== undefined) constant.current.initial = date;
      else date = new Date();
      setDate(date);
      const dialog = ref.current;
      if (dialog) dialog.showModal();
    });
  }

  function close() {
    const dialog = ref.current;
    if (dialog) dialog.close("false");
  }

  const month = date.getMonth() + 1,
    year = date.getFullYear(),
    SOMonth = startOfMonth(date),
    EOPMonth = endOfMonth(previousMonth(date)),
    EOMonth = endOfMonth(date);

  const [curMonth, prevMonth, nxtMonth] = useMemo(() => {
    const d: number[] = [],
      p: number[] = [],
      n: number[] = [];
    for (let i = 1; i < EOMonth.getDate() + 1; i++) d.push(i);
    for (let i = 0; i < SOMonth.getDay(); i++)
      p.unshift(EOPMonth.getDate() - i);
    for (
      let i = 0;
      i < 13 - EOMonth.getDay() && i + d.length + p.length < 42;
      i++
    )
      n.push(i + 1);
    return [d, p, n];
  }, [SOMonth.toDateString(), EOMonth.toDateString(), EOPMonth.toDateString()]);

  function handleClick(y: number, m: number, d: number) {
    const date = new Date(toValue(y, m, d));
    return (e: MouseEvent<HTMLButtonElement>) => {
      startTransition(() => {
        setDate(date);
      });
    };
  }

  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    const dialog = ref.current;
    if (!dialog) return;
    var rect = dialog.getBoundingClientRect();
    var isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) close();
  }

  function handleNextMonthDayClick(y: number, m: number, d: number) {
    const date = nextMonth(new Date(toValue(y, m, 1)));
    date.setDate(d);
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      startTransition(() => {
        setDate(date);
      });
    };
  }

  function handlePreviousMonthDayClick(y: number, m: number, d: number) {
    const date = previousMonth(new Date(`${year}-${month}-1`));
    date.setDate(d);
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      startTransition(() => {
        setDate(date);
      });
    };
  }

  function handleGoToPrevMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    startTransition(() => {
      setDate(previousMonth(date));
    });
  }

  function handleGoToNextMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    startTransition(() => {
      setDate(nextMonth(date));
    });
  }

  function GoToDay(d: Date) {
    startTransition(() => {
      setDate(d);
    });
  }

  const RelativeDate = {
    get today() {
      const d = new Date();
      d.setHours(0, 0, 0, 1);
      return d;
    },
    get tomorrow() {
      const d = new Date();
      d.setHours(24, 0, 0, 1);
      return d;
    },
    get nextWeek() {
      const d = new Date();
      d.setHours(24 * 7, 0, 0, 1);
      return d;
    },
    get nextMonth() {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      d.setHours(0, 0, 0, 1);
      return d;
    },
    get nextYear() {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      d.setHours(0, 0, 0, 1);
      return d;
    },
  };

  function handleToToday(e: MouseEvent<HTMLButtonElement>) {
    GoToDay(RelativeDate.today);
  }

  function handleToTomorrow(e: MouseEvent<HTMLButtonElement>) {
    GoToDay(RelativeDate.tomorrow);
  }

  function handleToNextWeek(e: MouseEvent<HTMLButtonElement>) {
    GoToDay(RelativeDate.nextWeek);
  }

  function handleToNextMonth(e: MouseEvent<HTMLButtonElement>) {
    GoToDay(RelativeDate.nextMonth);
  }

  function handleToNextYear(e: MouseEvent<HTMLButtonElement>) {
    GoToDay(RelativeDate.nextYear);
  }

  return (
    <CalendarContext.Provider
      value={{
        showModal,
        close,
        set onClose(cb: (date?: Date) => any) {
          constant.current.cb = cb;
        },
      }}
    >
      <dialog
        ref={ref}
        id="calendar"
        onClick={handleCancel}
        className="dropdown-modal relative mt-0 w-full min-w-0 max-w-screen-sm rounded-3xl rounded-t-none bg-primary-700 pb-8 after:absolute after:bottom-4 after:left-1/2 after:block after:h-1 after:w-1/4 after:-translate-x-1/2 after:rounded-sm after:bg-primary-800"
      >
        <div className="flex w-full items-center justify-between px-4 py-6 text-white">
          <IconButton
            aria-label="Click to go previous month"
            icon="ChevronLeft"
            className="tap-primary-900 ico-md bg-primary-800"
            onClick={handleGoToPrevMonth}
          />
          <h3 className="text-lg">{monthNames[month - 1] + "  " + year}</h3>
          <IconButton
            aria-label="Click to go next month"
            icon="ChevronRight"
            className="tap-primary-900 ico-md bg-primary-800"
            onClick={handleGoToNextMonth}
          />
        </div>
        <div className="grid grid-cols-7 px-2 text-center text-warning-100">
          {dayNames.map((d, i) => (
            <span key={i} className="day-name">
              {d}
            </span>
          ))}
        </div>
        <form method="dialog">
          <div className="grid grid-cols-7 justify-items-center px-2">
            {prevMonth.map((n) => {
              const value = toValue(year, month, n);
              return (
                <button
                  key={value}
                  className="tap-primary-800 btn-sm justify-center text-primary-900 transition"
                  value={value}
                  onClick={handlePreviousMonthDayClick(year, month, n)}
                >
                  {n}
                </button>
              );
            })}
            {curMonth.map((n) => {
              const value = toValue(year, month, n);
              return (
                <button
                  key={value}
                  value={value}
                  aria-current={isToday(year, month, n)}
                  aria-disabled={isPickedDate(date, year, month, n)}
                  onClick={handleClick(year, month, n)}
                  className="tap-primary-900 btn-sm justify-center text-white transition aria-disabled:bg-primary-900 aria-[current=true]:border-2 aria-[current=true]:border-white"
                >
                  {wildCard(n)}
                </button>
              );
            })}
            {nxtMonth.map((n) => {
              const value = toValue(year, month, n);
              return (
                <button
                  key={value}
                  value={value}
                  onClick={handleNextMonthDayClick(year, month, n)}
                  className="tap-primary-800 btn-sm justify-center text-primary-900 transition"
                >
                  {wildCard(n)}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 overflow-x-auto text-nowrap px-4 pb-2 pt-4">
            <Button
              className="tap-secondary-100 btn-sm min-w-fit bg-secondary-200 text-primary-800"
              value={date2str(RelativeDate.today)}
              onClick={handleToToday}
              aria-label="Go to today"
            >
              Today
            </Button>
            <Button
              className="tap-secondary-100 btn-sm min-w-fit bg-secondary-200 text-primary-800"
              value={date2str(RelativeDate.tomorrow)}
              onClick={handleToTomorrow}
              aria-label="Go to tomorrow"
            >
              Tomorrow
            </Button>
            <Button
              className="tap-secondary-100 btn-sm min-w-fit bg-secondary-200 text-primary-800"
              value={date2str(RelativeDate.nextWeek)}
              onClick={handleToNextWeek}
              aria-label="Go to next week"
            >
              Next Week
            </Button>
            <Button
              className="tap-secondary-100 btn-sm min-w-fit bg-secondary-200 text-primary-800"
              value={date2str(RelativeDate.nextMonth)}
              onClick={handleToNextMonth}
              aria-label="Go to next month"
            >
              Next Month
            </Button>
            <Button
              className="tap-secondary-100 btn-sm min-w-fit bg-secondary-200 text-primary-800"
              value={date2str(RelativeDate.nextYear)}
              onClick={handleToNextYear}
              aria-label="Go to next year"
            >
              Next Year
            </Button>
          </div>
        </form>
      </dialog>
      {props.children}
    </CalendarContext.Provider>
  );
}
