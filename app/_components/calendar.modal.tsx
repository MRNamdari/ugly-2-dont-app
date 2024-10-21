"use client";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useState, MouseEvent } from "react";
import IconButton from "./icon-button";
import Button from "./button";
import { wildCard } from "./util";

export default function Calendar(): JSX.Element {
  // hooks
  const { due = new Date() } = { due: new Date() };
  const [date, setDate] = useState(due);
  //   const router = useRouter();
  const navControl = useAnimation();
  const [direction, setDirection] = useState(1);
  //   const overlayRef = useRef(null);

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

  //   const { query } = router.query;
  //   useEffect(() => {
  //     if (!overlayRef.current) return;
  //     overlayRef.current.pop(navObj.pop);
  //     overlayRef.current.onClick = handleCancel;
  //   });

  //   if (query !== NavigationQuery.CALENDAR) return;

  //   const navObj = decodeNavigationParams(query, router.query);
  //   const pickedDate = new Date(navObj.params.date) || date;

  //   const setPickedDate = (date: Date) => {
  //     Object.assign(navObj, {
  //       query: navObj.caller ? navObj.caller : navObj.query,
  //       pop: navObj.caller ? true : false,
  //       caller: undefined,
  //     });
  //     navObj.params.date = date2str(date);
  //     router.replace(
  //       router.basePath +
  //         "?" +
  //         encodeNavigationParams(navObj, router.query).toString()
  //     );
  //   };

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

  //   function handleClick(
  //     e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  //   ) {
  //     e.preventDefault();
  //     const button = e.target as HTMLButtonElement;
  //     const [year, month, day] = button
  //       .getAttribute("data-date")
  //       .split("-")
  //       .map((d) => Number(d));
  //     // setPickedDate(new Date(`${year}-${month}-${day}`));
  //   }

  //   function handleCancel() {
  //     Object.assign(navObj, {
  //       query: navObj.caller ? navObj.caller : navObj.query,
  //       pop: navObj.caller ? true : false,
  //       caller: undefined,
  //     });
  //     router.replace(
  //       router.basePath +
  //         "?" +
  //         encodeNavigationParams(navObj, router.query).toString()
  //     );
  //   }

  //   function handleNextMonthDayClick(
  //     e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  //   ) {
  //     e.preventDefault();
  //     const button = e.target as HTMLButtonElement;
  //     const [year, month, day] = button
  //       .getAttribute("data-date")
  //       .split("-")
  //       .map((d) => Number(d));
  //     const d = nextMonth(new Date(`${year}-${month}-1`));
  //     d.setDate(day);
  //     // setDirection(1);
  //     setPickedDate(d);
  //     // setDate(d);
  //   }

  //   function handlePreviousMonthDayClick(
  //     e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  //   ) {
  //     e.preventDefault();
  //     const button = e.target as HTMLButtonElement;
  //     const [year, month, day] = button
  //       .getAttribute("data-date")
  //       .split("-")
  //       .map((d) => Number(d));
  //     const d = previousMonth(new Date(`${year}-${month}-1`));
  //     d.setDate(day);
  //     setPickedDate(d);
  //   }

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
    if (_date.getMonth() !== date.getMonth()) {
      setDirection(_date > date ? 1 : -1);
      setDate(_date);
    }
    // setPickedDate(_date);
    navControl.start("exit");
  }

  function handleToToday(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    GoToDay(d);
  }

  function handleToTomorrow(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    GoToDay(d);
  }

  function handleToNextWeek(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const d = new Date();
    d.setHours(24 * 7, 0, 0, 0);
    GoToDay(d);
  }

  function handleToNextMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setHours(0, 0, 0, 0);
    GoToDay(d);
  }

  function handleToNextYear(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    d.setHours(0, 0, 0, 0);
    GoToDay(d);
  }

  return (
    <>
      <dialog
        id="calendar"
        className="min-w-0 w-full max-w-screen-sm bg-primary-700 pb-4 mt-0 rounded-3xl rounded-t-none"
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
                className="btn-sm text-primary-900 tap-primary-800 w-fit"
                data-date={[year, month, n].join("-")}
                // onClick={handlePreviousMonthDayClick}
              >
                {n}
              </Button>
            ))}
            {dayNumbers.map((n, i) => {
              const d = new Date();
              //   if (
              //     year === pickedDate.getFullYear() &&
              //     month === pickedDate.getMonth() + 1 &&
              //     n == pickedDate.getDate()
              //   ) {
              //     return (
              //       <button
              //         key={i}
              //         className="btn solid sm primary"
              //         onClick={(e) => e.preventDefault()}
              //       >
              //         {n}
              //       </button>
              //     );
              //   }
              if (
                d.getDate() === n &&
                d.getMonth() + 1 === month &&
                d.getFullYear() === year
              ) {
                return (
                  <Button
                    key={i}
                    className="btn-sm text-white border-2 border-white w-fit"
                    data-date={[year, month, n].join("-")}
                    // onClick={handleClick}
                  >
                    {wildCard(n)}
                  </Button>
                );
              }

              return (
                <Button
                  key={i}
                  className="btn-sm text-white tap-primary-800 w-fit"
                  data-date={[year, month, n].join("-")}
                  //   onClick={handleClick}
                >
                  {wildCard(n)}
                </Button>
              );
            })}
            {nextDayNumbers.map((n, i) => (
              <Button
                key={-i}
                className="btn-sm text-primary-900 tap-primary-800 w-fit"
                data-date={[year, month, n].join("-")}
                // onClick={handleNextMonthDayClick}
              >
                {wildCard(n)}
              </Button>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="flex text-nowrap overflow-x-auto gap-2 px-4 pt-4 pb-2">
          <Button
            className="btn-sm bg-secondary-200 text-primary-800 w-fit tap-secondary-100"
            onClick={handleToToday}
            aria-label="Go to today"
          >
            Today
          </Button>
          <Button
            className="btn-sm bg-secondary-200 text-primary-800 w-fit tap-secondary-100"
            onClick={handleToTomorrow}
            aria-label="Go to tomorrow"
          >
            Tomorrow
          </Button>
          <Button
            className="btn-sm bg-secondary-200 text-primary-800 w-fit tap-secondary-100"
            onClick={handleToNextWeek}
            aria-label="Go to next week"
          >
            Next Week
          </Button>
          <Button
            className="btn-sm bg-secondary-200 text-primary-800 w-fit tap-secondary-100"
            onClick={handleToNextMonth}
            aria-label="Go to next month"
          >
            Next Month
          </Button>
          <Button
            className="btn-sm bg-secondary-200 text-primary-800 w-fit tap-secondary-100"
            onClick={handleToNextYear}
            aria-label="Go to next year"
          >
            Next Year
          </Button>
        </div>
        <hr className="h-1 border-none w-1/4 mx-auto bg-primary-800 rounded-md mt-4" />
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
