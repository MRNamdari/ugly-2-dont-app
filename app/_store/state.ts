import { signal, effect, computed } from "@preact/signals-react";
import {
  categories,
  ICategory,
  IProject,
  ISubTask,
  ITask,
  projects,
  tasks,
} from "./db";
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
        calendar.value ? date2display(calendar.value) : "Date*",
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
        clock.value ? timeToLocalTime(clock.value) : "Time*",
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
    add: {
      buttons: signal<{
        category?: string;
        project?: string;
        task?: string;
      }>({}),
    },
  };
})();

export const store = {
  tasks: signal(tasks),
  projects: signal(projects),
  categories: signal(categories),
  selection: signal<{ category: number[]; project: number[]; task: number[] }>({
    category: [],
    project: [],
    task: [],
  }),
};

export const isSelectionStarted = computed(() =>
  Object.values(store.selection.value).some((f) => f.length > 0),
);

export function encodeURL(struct: any) {
  const url = new URLSearchParams(struct);
  return "?" + url;
}

// export function TaskToFormData(t?: ITask): ITaskFormData | undefined {
//   if (!t) return;
//   const {
//     title,
//     categoryId: category,
//     description,
//     due,
//     priority,
//     projectId: project,
//     subtasks,
//   } = t;
//   const date = new Date(due);
//   modals.calendar.signal.value = date;
//   modals.clock.signal.value = date;
//   const flatSubtasks = {};
//   subtasks?.map((s) => {
//     Object.assign(flatSubtasks, {
//       ["st" + s.id]: s.title,
//       ["ss" + s.id]: s.status ? "1" : "0",
//     });
//   });
//   return {
//     title,
//     description,
//     project,
//     category,
//     time: `${wildCard(date.getHours())}:${wildCard(date.getMinutes())}`,
//     date: `${date.getFullYear()}-${wildCard(date.getMonth() + 1)}-${wildCard(date.getDate())}`,
//     priority,
//     ...flatSubtasks,
//   };
// }

// export function FormDataToTask(fd: ITaskFormData): ITask {
//   const {
//     category,
//     date,
//     description,
//     id,
//     priority,
//     project,
//     // reminder,
//     time,
//     title,
//   } = fd;
//   const due = new Date(date!);
//   const [h, m] = time!.split(":").map((i) => parseInt(i));
//   due.setHours(h, m);
//   const subtasks: ISubTask[] = Object.keys(fd)
//     .filter((k) => /^st[0-9]+$/.test(k))
//     .map((key) => {
//       const id = key.slice(2);
//       return {
//         id,
//         title: fd[key as `st${string}`]!,
//         status: fd[`ss${id}`] == "0" ? false : true,
//       };
//     });
//   return {
//     id: (id as TaskId) ?? "t" + store.tasks.peek().length + 1,
//     title: title ?? "",
//     description,
//     projectId: project as ProjectId,
//     categoryId: category as CategoryId,
//     due: due.toISOString(),
//     priority,
//     status: false,
//     subtasks,
//   };
// }

// export function ProjectToFormData(p?: IProject): IProjectFormData | undefined {
//   if (!p) return;
//   const {
//     title,
//     categoryId: category,
//     description,
//     due,
//     projectId: project,
//     priority,
//   } = p;
//   const date = new Date(due);
//   modals.calendar.signal.value = date;
//   modals.clock.signal.value = date;
//   return {
//     title,
//     description,
//     project,
//     category,
//     time: `${wildCard(date.getHours())}:${wildCard(date.getMinutes())}`,
//     date: `${date.getFullYear()}-${wildCard(date.getMonth() + 1)}-${wildCard(date.getDate())}`,
//     priority,
//   };
// }

// export function FormDataToProject(fd: IProjectFormData): IProject {
//   const {
//     category,
//     date,
//     description,
//     id,
//     priority,
//     project,
//     // reminder,
//     time,
//     title,
//   } = fd;
//   const due = new Date(date!);
//   const [h, m] = time!.split(":").map((i) => parseInt(i));
//   due.setHours(h, m);
//   return {
//     id: (id as ProjectId) ?? "p" + store.tasks.peek().length + 1,
//     title: title ?? "",
//     description,
//     projectId: project as ProjectId,
//     categoryId: category as CategoryId,
//     due: due.toISOString(),
//     priority,
//   };
// }

// export function PendingTasksCount(projectId: ProjectId) {
//   return computed(() => {
//     const projectList = ExtractProjects(projectId);
//     const allTasks = SelectTasksByProjectId(projectList);
//     return [
//       allTasks.length,
//       allTasks.filter((t) => t.status === false).length,
//     ] as const;
//   });
// }

// export function ExtractProjects(id: ProjectId): ProjectId[] {
//   const directChildren = store.projects.value
//     .filter((p) => p.projectId == id)
//     .map((p) => p.id);
//   if (directChildren.length > 0) {
//     return [id].concat(directChildren.map((id) => ExtractProjects(id)).flat());
//   } else {
//     return [id];
//   }
// }

// export function ExtractCategories(id?: CategoryId): CategoryId[] {
//   const directChildren = id
//     ? store.categories.value.filter((c) => c.categoryId == id).map((c) => c.id)
//     : store.categories.value
//         .filter((c) => c.categoryId === undefined)
//         .map((c) => c.id);
//   const arr = id ? [id] : [];
//   if (directChildren.length > 0) {
//     return arr.concat(directChildren.map((id) => ExtractCategories(id)).flat());
//   } else {
//     return arr;
//   }
// }

// export function SelectTasksByProjectId(id: ProjectId): ITask[];
// export function SelectTasksByProjectId(id: ProjectId[]): ITask[];
// export function SelectTasksByProjectId(id: ProjectId | ProjectId[]): ITask[] {
//   if (Array.isArray(id)) {
//     return id.map((pid) => SelectTasksByProjectId(pid)).flat();
//   } else {
//     return store.tasks.value.filter((t) => t.projectId === id);
//   }
// }

// export function SelectTasksByCategoryId(id?: CategoryId): ITask[];
// export function SelectTasksByCategoryId(id: CategoryId[]): ITask[];
// export function SelectTasksByCategoryId(
//   id: CategoryId | CategoryId[] | undefined,
// ): ITask[] {
//   if (Array.isArray(id)) {
//     return id.map((pid) => SelectTasksByCategoryId(pid)).flat();
//   } else if (id !== undefined) {
//     return store.tasks.value.filter((t) => t.categoryId === id);
//   } else {
//     return store.tasks.value.filter((t) => t.categoryId === undefined);
//   }
// }

// export function SelectTaskById(id?: TaskId): Partial<ITask> {
//   return store.tasks.value.find((t) => t.id === id) ?? {};
// }

// export function SelectProjectByCategoryId(id?: CategoryId): IProject[];
// export function SelectProjectByCategoryId(id: CategoryId[]): IProject[];
// export function SelectProjectByCategoryId(
//   id: CategoryId | CategoryId[] | undefined,
// ) {
//   if (Array.isArray(id)) {
//     return id.map((cid) => SelectProjectByCategoryId(cid)).flat();
//   } else if (id !== undefined) {
//     return store.projects.value.filter((p) => p.categoryId === id);
//   } else {
//     return store.projects.value.filter((p) => p.categoryId === undefined);
//   }
// }

// export function SelectCategoryByCategoryId(id?: CategoryId) {
//   return computed(() =>
//     store.categories.value.filter((c) => c.categoryId === id),
//   );
// }

// export function RemoveProjectById(id: ProjectId) {
//   const projects = ExtractProjects(id);
//   const tasks = SelectTasksByProjectId(projects).map((t) => t.id);
//   store.projects.value = store.projects.value.filter(
//     (p) => !projects.includes(p.id),
//   );
//   store.tasks.value = store.tasks.value.filter((t) => !tasks.includes(t.id));
// }
// export function RemoveCategoryById(id: CategoryId) {}

export function RemoveFromSelection(feature: "category", id: number): void;
export function RemoveFromSelection(feature: "project", id: number): void;
export function RemoveFromSelection(feature: "task", id: number): void;
export function RemoveFromSelection(
  feature: "category" | "project" | "task",
  fid: number,
) {
  const selMgr = store.selection.value;
  selMgr[feature].filter((id) => fid !== id);
  store.selection.value = selMgr;
}
export function AddToSelection(feature: "category", id: number): void;
export function AddToSelection(feature: "project", id: number): void;
export function AddToSelection(feature: "task", id: number): void;
export function AddToSelection(
  feature: "category" | "project" | "task",
  fid: number,
) {
  const selMgr = store.selection.value;
  selMgr[feature].concat(fid);
  store.selection.value = selMgr;
}

// export const TaskFormDataSignal = signal<ITaskFormData>({});
export const TaskFormDataSignal = signal<Partial<ITask>>({});

// export function TasksProgressByCategory(id?: CategoryId) {
//   return computed(() => {
//     if (id !== undefined) {
//       const categories = ExtractCategories(id);
//       const tasks = categories
//         .map((cid) => SelectTasksByCategoryId(cid))
//         .flat();
//       return [tasks.length, tasks.filter((t) => t.status).length] as const;
//     } else {
//       const tasks = store.tasks.value;
//       return [tasks.length, tasks.filter((t) => t.status).length] as const;
//     }
//   });
// }

// export function ProjectProgressByCategory(id?: CategoryId) {
//   return computed(() => {
//     const categories = ExtractCategories(id);
//     const projects = [
//       ...new Set(
//         categories.map((cid) => SelectProjectByCategoryId(cid)).flat(),
//       ),
//     ];
//     const prog = projects.map((p) => {
//       const [a, i] = PendingTasksCount(p.id).value;
//       return a == 0 ? 1 : ((i > 0 ? 0 : 1) as number);
//     });
//     // debugger;
//     return [prog.length, prog.reduce((a, c) => a + c, 0)] as const;
//   });
// }

// export function CategoryInfo(id?: CategoryId) {
//   return computed(() => {
//     const categories = ExtractCategories(id);
//     const projects = [
//       ...new Set(
//         categories
//           .map((cid) => SelectProjectByCategoryId(cid))
//           .flat()
//           .map((p) => p.id),
//       ),
//     ];
//     const tasks = [
//       ...new Set([
//         ...projects.map(SelectTasksByProjectId).flat(),
//         ...categories.map(SelectTasksByCategoryId).flat(),
//       ]),
//     ];
//     return {
//       tasks: tasks.length,
//       projects: projects.length,
//       categories: categories.length,
//     };
//   });
// }

// export function AddCategory(
//   title: ICategory["title"],
//   categoryId: ICategory["categoryId"],
// ) {
//   const cats = store.categories.value;
//   const id: CategoryId = `c${cats.length + 1}`;
//   store.categories.value = cats.concat({ id, title });
// }
