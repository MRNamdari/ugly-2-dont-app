export function quickSort<T>(
  array: T[],
  high: number,
  low: number,
  extract?: (arg: T) => number | string | T,
): T[] {
  if (low < high) {
    // find pivot element such that
    // element smaller than pivot are on the left
    // element greater than pivot are on the right
    const pi = partition(high, low);

    // recursive call on the left of pivot
    quickSort(array, pi - 1, low, extract);

    // recursive call on the right of pivot
    quickSort(array, high, pi + 1, extract);
  }
  return array;

  function partition(high: number, low: number) {
    // choose the rightmost element as pivot
    const pivot = array[high];

    // pointer for greater element
    let i = low - 1;

    // set extract if not defined
    if (!extract) extract = (val: any) => val;

    // traverse through all elements
    // compare each element with pivot
    for (let j = low; j < high; j++) {
      if (extract(array[j]) <= extract(pivot)) {
        // if element smaller than pivot is found
        // swap it with the greatr element pointed by i
        i++;

        // swapping element at i with element at j
        swap(array, i, j);
      }
    }

    // swapt the pivot element with the greater element specified by i
    swap(array, i + 1, high);

    // return the position from where partition is done
    return i + 1;
  }

  // Function to swap two elements
  function swap<T>(arr: T[], i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

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
 * converts standard ISO/JSON stringified date to `Date` object
 * @param str
 * @returns `Date`
 */
export function str2date(str: string | any) {
  return new Date(str);
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
 * converts an array consist of HH and MM to 24h timstring
 * @param n
 * @returns "HH:MM"
 */
export function num2timestring(n: number[]) {
  return `${num2str(n[0])}:${num2str(n[1])}`;
}

/**
 * converts 24h timestring to an array
 * @param s
 * @returns `[HH, MM]`
 */
export function str2time(s: string | any): number[] {
  return s.split(":").map((v: string) => Number(v));
}

/**
 * converts 12h time string to 24h format
 * @param s
 * @returns "HH:MM"
 */
export function localTimeToTime(s: string) {
  if (s.length == 0) return undefined;

  return date2time(new Date(s));
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
  let m = time.getUTCMinutes();
  return `${num2str(h)}:${num2str(m)} ${ap}`;
}

/**
 * converts a given `Date` object into local timestring
 * @param d
 * @returns time in format "HH:MM AM/PM"
 */
export function dateToLocalTime(d: Date) {
  let HH = d.getHours(),
    MM = d.getMinutes(),
    ampm = HH >= 12 ? "PM" : "AM";
  HH = HH % 12;
  HH = HH ? HH : 12; // the hour '0' should be '12'
  return `${num2str(HH)}:${num2str(MM)} ${ampm}`;
}

/**
 * converts a given `Date` object into timestring
 * @param d
 * @returns time in format "HH:MM"
 */
export function date2time(d: Date) {
  let HH = d.getHours(),
    MM = d.getMinutes();
  return `${num2str(HH)}:${num2str(MM)}`;
}

export function wildCard(n: number | string) {
  const num = typeof n == "string" ? parseInt(n) : n;
  return num < 10 ? "0" + num : num.toString();
}
