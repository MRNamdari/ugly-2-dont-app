export function date2str(date: Date | string) {
  if (typeof date === "string") date = new Date(date);
  return `${date.getFullYear()}-${num2str(date.getMonth() + 1)}-${num2str(
    date.getDate(),
  )}`;
}
/**
 * Checks if the given date is whitin a given day
 * @param date
 * @param startOfDay time of the start of the day in time
 * @returns boolean
 */
export function isDay(
  date: Date,
  startOfDay: number = new Date().setHours(0, 0, 0, 0),
) {
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59);
  if (startOfDay <= date.getTime() && date <= endOfDay) return true;
  return false;
}

/**
 * converts given string or date object to "`MonthName` `DayWithOrdinal`"
 * @param date
 * @example date2display(d) // Sep 21st
 */
export function date2display(date: Date | string): string {
  if (typeof date === "string") date = new Date(date);

  if (isDay(date, new Date().setHours(-24, 0, 0, 0))) return "Yesterday";
  if (isDay(date)) return "Today";
  if (isDay(date, new Date().setHours(24, 0, 0, 0))) return "Tomorrow";

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const year =
    date.getFullYear() === new Date().getFullYear()
      ? ""
      : ", " + date.getFullYear();
  return `${month[date.getMonth()]}  ${day}${year}`;
}

/**
 * add a 0 before one digit numbers
 * @param n
 * @example num2str(5) // "05"
 */
export function num2str(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * converts ISO/JSON stringified `Date` to local timestring
 * @param s
 * @returns time in format "HH:MM AM/PM"
 */
export function timeToLocalTime(time: Date) {
  let h = time.getUTCHours();
  const ap = h < 12 ? "AM" : "PM";
  h = h == 0 ? 12 : h;
  h -= h > 12 ? 12 : 0;
  const m = time.getUTCMinutes();
  return `${num2str(h)}:${num2str(m)} ${ap}`;
}

/**
 * converts a given `Date` object into local timestring
 * @param d
 * @returns time in format "HH:MM AM/PM"
 */
export function dateToLocalTime(d: Date) {
  let HH = d.getHours();
  const MM = d.getMinutes(),
    ampm = HH >= 12 ? "PM" : "AM";
  HH = HH % 12;
  HH = HH ? HH : 12; // the hour '0' should be '12'
  return `${num2str(HH)}:${num2str(MM)} ${ampm}`;
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
