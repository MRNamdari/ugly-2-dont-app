import { signal, effect, computed } from "@preact/signals-react";
import {
  categories,
  CategoryId,
  IProject,
  IProjectFormData,
  ISubTask,
  ITask,
  ITaskFormData,
  ProjectId,
  projects,
  TaskId,
  tasks,
} from "./data";
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
    delete: {
      message: signal<string>(""),
    },
  };
})();

type FeatureID = `p${number}` | `t${number}` | `c${number}`;

export const store = {
  tasks: signal(tasks),
  projects: signal(projects),
  categories: signal(categories),
  selection: signal<FeatureID[]>([]),
};

export const isSelectionStarted = computed(
  () => store.selection.value.length > 0
);

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

export function FormDataToTask(fd: ITaskFormData): ITask {
  const {
    category,
    date,
    description,
    id,
    priority,
    project,
    // reminder,
    time,
    title,
  } = fd;
  const due = new Date(date!);
  const [h, m] = time!.split(":").map((i) => parseInt(i));
  due.setHours(h, m);
  const subtasks: ISubTask[] = Object.keys(fd)
    .filter((k) => /^st[0-9]+$/.test(k))
    .map((key) => {
      const id = key.slice(2);
      return {
        id,
        title: fd[key as `st${string}`]!,
        status: fd[`ss${id}`] == "0" ? false : true,
      };
    });
  return {
    id: (id as TaskId) ?? "t" + store.tasks.peek().length + 1,
    title: title ?? "",
    description,
    projectId: project as ProjectId,
    categoryId: category as CategoryId,
    due: due.toISOString(),
    priority,
    status: false,
    subtasks,
  };
}

export function ProjectToFormData(p?: IProject): IProjectFormData | undefined {
  if (!p) return;
  const {
    title,
    categoryId: category,
    description,
    due,
    projectId: project,
    priority,
  } = p;
  const date = new Date(due);
  modals.calendar.signal.value = date;
  modals.clock.signal.value = date;
  return {
    title,
    description,
    project,
    category,
    time: `${wildCard(date.getHours())}:${wildCard(date.getMinutes())}`,
    date: `${date.getFullYear()}-${wildCard(date.getMonth() + 1)}-${wildCard(date.getDate())}`,
    priority,
  };
}

export function FormDataToProject(fd: IProjectFormData): IProject {
  const {
    category,
    date,
    description,
    id,
    priority,
    project,
    // reminder,
    time,
    title,
  } = fd;
  const due = new Date(date!);
  const [h, m] = time!.split(":").map((i) => parseInt(i));
  due.setHours(h, m);
  return {
    id: (id as ProjectId) ?? "p" + store.tasks.peek().length + 1,
    title: title ?? "",
    description,
    projectId: project as ProjectId,
    categoryId: category as CategoryId,
    due: due.toISOString(),
    priority,
  };
}
