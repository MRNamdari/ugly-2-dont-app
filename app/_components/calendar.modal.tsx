"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, MouseEvent } from "react";
import IconButton from "./icon-button";
import Button from "./button";
import { wildCard } from "./util";
import { modals } from "../_store/state";
import { useSignalEffect } from "@preact/signals-react";

const pickedDate = modals.calendar.signal;

export default function Calendar(): JSX.Element {
  // hooks

  const [date, setDate] = useState(new Date());
  const [direction, setDirection] = useState(1);

  useSignalEffect(() => {
    if (pickedDate.value) setDate(pickedDate.value);
  });

  const dayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;
  const monthNames = [
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

  const [month, year] = [date.getMonth() + 1, date.getFullYear()];
  const SOMonth = startOfMonth(date);
  const EOPMonth = endOfMonth(previousMonth(date));
  const EOMonth = endOfMonth(date);

  const dayNumbers: number[] = [];
  const previousDayNumbers: number[] = [];
  const nextDayNumbers: number[] = [];
  for (let i = 1; i < EOMonth.getDate() + 1; i++) dayNumbers.push(i);
  for (let i = 0; i < SOMonth.getDay(); i++)
    previousDayNumbers.unshift(EOPMonth.getDate() - i);
  for (
    let i = 0;
    i < 13 - EOMonth.getDay() &&
    i + dayNumbers.length + previousDayNumbers.length < 42;
    i++
  )
    nextDayNumbers.push(i + 1);

  const variants = {
    enter: (direction: number) => {
      return {
        y: direction > 0 ? 50 : -50,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        y: direction < 0 ? 50 : -50,
        opacity: 0,
      };
    },
  };

  function handleClick(y: number, m: number, d: number) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      const date = new Date(`${y}-${m}-${d}`);
      setDate(date);
      pickedDate.value = date;
    };
  }

  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    var rect = (e.target as HTMLDialogElement).getBoundingClientRect();
    var isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      (e.target as HTMLDialogElement).close();
    }
  }

  function handleNextMonthDayClick(y: number, m: number, d: number) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const date = nextMonth(new Date(`${y}-${m}-1`));
      date.setDate(d);
      setDate(date);
      setDirection(1);
      pickedDate.value = date;
    };
  }

  function handlePreviousMonthDayClick(y: number, m: number, d: number) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const date = previousMonth(new Date(`${year}-${month}-1`));
      date.setDate(d);
      setDate(date);
      pickedDate.value = date;
    };
  }

  function handleGoToPrevMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDate(previousMonth(date));
    setDirection(1);
  }

  function handleGoToNextMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDirection(-1);
    setDate(nextMonth(date));
  }

  function GoToDay(_date: Date) {
    setDate(_date);
    if (_date.getMonth() !== date.getMonth()) {
      setDirection(_date > date ? 1 : -1);
    }
    pickedDate.value = _date;
  }

  function handleToToday(e: MouseEvent<HTMLButtonElement>) {
    const d = new Date();
    d.setHours(0, 0, 0, 1);
    GoToDay(d);
  }

  function handleToTomorrow(e: MouseEvent<HTMLButtonElement>) {
    const d = new Date();
    d.setHours(24, 0, 0, 1);
    GoToDay(d);
  }

  function handleToNextWeek(e: MouseEvent<HTMLButtonElement>) {
    const d = new Date();
    d.setHours(24 * 7, 0, 0, 1);
    GoToDay(d);
  }

  function handleToNextMonth(e: MouseEvent<HTMLButtonElement>) {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setHours(0, 0, 0, 1);
    GoToDay(d);
  }

  function handleToNextYear(e: MouseEvent<HTMLButtonElement>) {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    d.setHours(0, 0, 0, 1);
    GoToDay(d);
  }

  return (
    <>
      <dialog
        id="calendar"
        onClick={handleCancel}
        className="min-w-0 w-full max-w-screen-sm bg-primary-700 pb-8 mt-0 rounded-3xl rounded-t-none relative after:block after:absolute after:w-1/4 after:h-1 after:bg-primary-800 after:rounded-sm after:left-1/2 after:-translate-x-1/2 after:bottom-4"
      >
        <div className="flex items-center w-full justify-between px-4 py-6 text-white">
          <IconButton
            aria-label="Click to go previous month"
            icon="ChevronLeft"
            className="ico-md bg-primary-800 tap-primary-900"
            onClick={handleGoToPrevMonth}
          />
          <h3 className="text-lg">
            {monthNames[month - 1]} {year}
          </h3>
          <IconButton
            aria-label="Click to go next month"
            icon="ChevronRight"
            className="ico-md bg-primary-800 tap-primary-900"
            onClick={handleGoToNextMonth}
          />
        </div>
        <div className="grid grid-cols-7 text-center text-warning-100 px-2">
          {dayNames.map((d, i) => (
            <span key={i} className="day-name">
              {d}
            </span>
          ))}
        </div>
        <form method="dialog">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={date.toDateString()}
              className="grid grid-cols-7 justify-items-center px-2"
              custom={direction}
              variants={variants}
              initial="exit"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", damping: 10 },
                opacity: { ease: "anticipate", duration: 0.1 },
              }}
            >
              {previousDayNumbers.map((n, i) => (
                <Button
                  key={-i}
                  className="btn-sm text-primary-900 tap-primary-800 justify-center"
                  value={[year, month, n].join("-")}
                  onClick={handlePreviousMonthDayClick(year, month, n)}
                >
                  {n}
                </Button>
              ))}
              {dayNumbers.map((n, i) => {
                if (isPickedDate(year, month, n)) {
                  return (
                    <Button
                      key={i}
                      value={[year, month, n].join("-")}
                      className={
                        "btn-sm text-white justify-center bg-primary-900 tap-primary-900 " +
                        (isToday(year, month, n) ? "border-2 border-white" : "")
                      }
                    >
                      {n}
                    </Button>
                  );
                }

                if (isToday(year, month, n)) {
                  return (
                    <Button
                      key={i}
                      value={[year, month, n].join("-")}
                      onClick={handleClick(year, month, n)}
                      className="btn-sm text-white border-2 border-white justify-center tap-primary-800"
                    >
                      {wildCard(n)}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={i}
                    value={[year, month, n].join("-")}
                    onClick={handleClick(year, month, n)}
                    className="btn-sm text-white tap-primary-800 justify-center"
                  >
                    {wildCard(n)}
                  </Button>
                );
              })}
              {nextDayNumbers.map((n, i) => (
                <Button
                  key={-i}
                  value={[year, month, n].join("-")}
                  onClick={handleNextMonthDayClick(year, month, n)}
                  className="btn-sm text-primary-900 tap-primary-800 justify-center"
                >
                  {wildCard(n)}
                </Button>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="flex text-nowrap overflow-x-auto gap-2 px-4 pt-4 pb-2">
            <Button
              className="btn-sm bg-secondary-200 text-primary-800 min-w-fit tap-secondary-100"
              onClick={handleToToday}
              aria-label="Go to today"
            >
              Today
            </Button>
            <Button
              className="btn-sm bg-secondary-200 text-primary-800 min-w-fit tap-secondary-100"
              onClick={handleToTomorrow}
              aria-label="Go to tomorrow"
            >
              Tomorrow
            </Button>
            <Button
              className="btn-sm bg-secondary-200 text-primary-800 min-w-fit tap-secondary-100"
              onClick={handleToNextWeek}
              aria-label="Go to next week"
            >
              Next Week
            </Button>
            <Button
              className="btn-sm bg-secondary-200 text-primary-800 min-w-fit tap-secondary-100"
              onClick={handleToNextMonth}
              aria-label="Go to next month"
            >
              Next Month
            </Button>
            <Button
              className="btn-sm bg-secondary-200 text-primary-800 min-w-fit tap-secondary-100"
              onClick={handleToNextYear}
              aria-label="Go to next year"
            >
              Next Year
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

function nextMonth(date: Date) {
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];
  return new Date(
    `${month + 1 > 12 ? year + 1 : year}-${month + 1 > 12 ? 1 : month + 1}-1`
  );
}

function previousMonth(date: Date) {
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];
  return new Date(
    `${month - 1 < 1 ? year - 1 : year}-${month - 1 < 1 ? 12 : month - 1}-1`
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

function isPickedDate(y: number, m: number, d: number) {
  const date = pickedDate.value;
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
