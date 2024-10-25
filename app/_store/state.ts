import { signal, effect, computed } from "@preact/signals-react";
import { categories, ITask, ITaskFormData, projects, tasks } from "./data";
import { date2display, timeToLocalTime, wildCard } from "../_components/util";

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
          return `${date.getFullYear()}-${wildCard(date.getMonth() + 1)}-${wildCard(date.getDate())}`;
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
          return `${wildCard(date.getHours())}:${wildCard(date.getMinutes())}`;
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

export function encodeURL(struct: any) {
  const url = new URLSearchParams(struct);
  return "?" + url;
}

export function TaskToFormData(t?: ITask): ITaskFormData | undefined {
  if (!t) return;
  const {
    title,
    categoryId: category,
    description,
    due,
    priority,
    projectId: project,
    subtasks,
  } = t;
  const date = new Date(due);
  modals.calendar.signal.value = date;
  modals.clock.signal.value = date;
  const flatSubtasks = {};
  subtasks?.map((s) => {
    Object.assign(flatSubtasks, {
      ["st" + s.id]: s.title,
      ["ss" + s.id]: s.status ? "1" : "0",
    });
  });
  return {
    title,
    description,
    project,
    category,
    time: `${wildCard(date.getHours())}:${wildCard(date.getMinutes())}`,
    date: `${date.getFullYear()}-${wildCard(date.getMonth() + 1)}-${wildCard(date.getDate())}`,
    priority,
    ...flatSubtasks,
  };
}
