import { signal, effect, computed } from "@preact/signals-react";
import { categories, projects, tasks } from "./data";
import { date2display, timeToLocalTime } from "../_components/util";

// export const modals = {
//   calendar: signal<Date>(),
//   clock: signal<Date>(),
// };

export const modals = (function modal() {
  const calendar = signal<Date>();
  const clock = signal<Date>();
  return {
    calendar: {
      signal: calendar,
      display: computed(() =>
        calendar.value ? date2display(calendar.value) : "Date*"
      ),
      value: computed(() => {
        const date = calendar.value;
        if (date) {
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        return "";
      }),
    },
    clock: {
      signal: clock,
      display: computed(() =>
        clock.value ? timeToLocalTime(clock.value) : "Time*"
      ),
      value: computed(() => {
        const date = clock.value;
        if (date) {
          return `${date.getHours()}:${date.getMinutes()}`;
        }
        return "";
      }),
    },
  };
})();

export const store = {
  tasks: signal(tasks),
  projects: signal(projects),
  categories: signal(categories),
};
