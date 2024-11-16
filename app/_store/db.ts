import Dexie, { Table } from "dexie";

export type ICategory = {
  title: string;
  id: number;
  category?: number;
};
export type IProject = {
  title: string;
  id: number;
  date: Date;
  time: Date;
  due?: Date;
  description?: string;
  priority?: 0 | 1 | 2;
  category?: number;
  project?: number;
};
export type ITask = {
  title: string;
  id: number;
  status: boolean;
  description?: string;
  subtasks?: ISubTask[];
  project?: number;
  category?: number;
  date: Date;
  time: Date;
  due?: Date;
  reminder?: Date;
  priority?: 0 | 1 | 2;
};

export type ISubTask = { title: string; id: number; status: boolean };

export enum IPriority {
  High = "2",
  Medium = "1",
  Low = "0",
}

export const Priority = {
  0: "High",
  1: "Medium",
  2: "Low",
  High: 2,
  Medium: 1,
  Low: 0,
} as const;

function time2date(t: string) {
  const d = new Date();
  const [h, m] = t.split(":").map((s) => parseInt(s));
  const time = m * 60 * 1000 + h * 60 * 60 * 1000;
  d.setTime(time);
  return d;
}

export function string2date(s: string) {
  const [y, m, d] = s.split("-").map((s) => parseInt(s));
  return new Date(y, m - 1, d);
}

export const tasks: ITask[] = [
    {
      title: "Buy groceries",
      id: 1,
      status: false,
      description: "Milk, eggs, bread, cheese",
      project: 1,
      category: 1,
      date: string2date("2024-10-13"),
      time: time2date("09:00"),
      reminder: string2date("2023-08-25T18:00:00"),
      priority: 2,
    },
    {
      title: "Call the doctor",
      id: 2,
      status: true,
      description: "Schedule an appointment for next week",
      project: 2,
      category: 2,
      date: string2date("2024-08-28"),
      time: time2date("10:00"),
      priority: 1,
    },
    {
      title: "Write a blog post",
      id: 3,
      status: false,
      description: "Write a blog post about my recent vacation",
      subtasks: [
        { title: "Do research", id: 1, status: true },
        { title: "Write the first draft", id: 2, status: false },
        { title: "Edit and proofread", id: 3, status: false },
      ],
      project: 3,
      category: 3,
      date: string2date("2025-08-30"),
      time: time2date("12:00"),
      priority: 0,
    },
    {
      title: "Meet with client",
      id: 4,
      status: false,
      description: "Discuss the new project",
      project: 2,
      category: 2,
      date: string2date("2024-09-29"),
      time: time2date("14:00"),
      reminder: string2date("2023-08-28T12:00:00"),
      priority: 2,
    },
    {
      title: "Go to the gym",
      id: 5,
      status: true,
      description: "Work out for 30 minutes",
      category: 1,
      date: string2date("2024-12-27"),
      time: time2date("18:00"),
      priority: 1,
    },
    {
      title: "Plan a vacation",
      id: 6,
      status: false,
      description: "Choose a destination and book flights and hotels",
      subtasks: [
        { title: "Research destinations", id: 104, status: false },
        { title: "Book flights", id: 105, status: true },
        { title: "Book hotels", id: 106, status: true },
      ],
      category: 3,
      date: string2date("2025-09-15"),
      time: time2date("12:00"),
      priority: 0,
    },
    {
      title: "Learn a new language",
      id: 7,
      status: false,
      description: "Start learning Spanish",
      category: 1,
      date: string2date("2025-09-30"),
      time: time2date("12:00"),
      priority: 1,
    },
    {
      title: "Read a book",
      id: 8,
      status: true,
      description: "Read 'The Alchemist' by Paulo Coelho",
      category: 3,
      date: string2date("2025-09-01"),
      time: time2date("15:00"),
      priority: 0,
    },
    {
      title: "Start a blog",
      id: 9,
      status: false,
      description: "Write about my thoughts and experiences",
      category: 3,
      date: string2date("2025-10-01"),
      time: time2date("17:00"),
      priority: 2,
    },
    {
      title: "Learn to code",
      id: 10,
      status: true,
      description: "Start learning Python",
      category: 1,
      date: string2date("2025-12-01"),
      time: time2date("12:00"),
      priority: 1,
    },
    {
      title: "Get a promotion",
      id: 11,
      status: false,
      description: "Work hard and impress my boss",
      category: 2,
      date: string2date("2025-01-01"),
      time: time2date("10:00"),
      priority: 2,
    },
    {
      title: "Start a business",
      id: 12,
      status: true,
      description: "Come up with a business idea and start working on it",
      category: 1,
      date: string2date("2025-03-01"),
      time: time2date("08:00"),
      priority: 0,
    },
    {
      title: "Travel the world",
      id: 13,
      status: false,
      description: "Visit all seven continents",
      category: 3,
      date: string2date("2025-01-01"),
      time: time2date("07:00"),
      priority: 1,
    },
    {
      title: "Make a difference in the world",
      id: 14,
      status: true,
      description: "Volunteer my time to help others",
      category: 1,
      date: string2date("2025-12-31"),
      time: time2date("06:30"),
      priority: 2,
    },
    {
      title: "Buy PC",
      id: 15,
      status: false,
      category: 0,
      description: "Monitor, Mice, Keyboard, Speaker",
      reminder: string2date("2023-09-25T18:00:00"),
      date: string2date("2025-02-25"),
      time: time2date("13:45"),
      priority: 2,
    },
  ],
  projects: IProject[] = [
    {
      title: "Groceries",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      id: 1,
      project: 5,
      category: 1,
      date: string2date("2025-11-01"),
      time: time2date("00:00"),
      priority: 2,
    },
    {
      title: "Doctor's appointments",
      id: 2,
      category: 2,
      date: string2date("2025-01-13"),
      time: time2date("19:30"),
      priority: 1,
    },
    {
      title: "Blog posts",
      id: 3,
      project: 4,
      category: 3,
      date: string2date("2024-12-26"),
      time: time2date("09:00"),
      priority: 0,
    },
    {
      title: "Work",
      id: 4,
      category: 2,
      priority: 2,
      date: string2date("2025-01-10"),
      time: time2date("08:30"),
    },
    {
      title: "Personal",
      id: 5,
      date: string2date("2024-11-10"),
      time: time2date("22:30"),
      category: 1,
      priority: 1,
    },
    {
      title: "Creative",
      id: 6,
      date: string2date("2025-03-15"),
      time: time2date("16:30"),
      project: 5,
      category: 3,
      priority: 0,
    },
  ],
  categories: ICategory[] = [
    { title: "Personal", id: 1, category: 0 },
    { title: "Work", id: 2, category: 0 },
    { title: "Creative", id: 3, category: 0 },
    { title: "Health", id: 4, category: 1 },
    { title: "Finances", id: 5, category: 1 },
    { title: "Relationships", id: 6, category: 1 },
    { title: "Hobbies", id: 7, category: 1 },
    { title: "Spirituality", id: 8, category: 1 },
    { title: "Projects", id: 9, category: 2 },
    { title: "Teamwork", id: 10, category: 2 },
    { title: "Communication", id: 11, category: 2 },
    { title: "Problem solving", id: 12, category: 2 },
    { title: "Leadership", id: 13, category: 2 },
  ];

//OrderBy time,date doesn't work
class UglyDB extends Dexie {
  tasks!: Table<ITask, number>;
  projects!: Table<IProject, number>;
  categories!: Table<ICategory, number>;
  constructor() {
    super("UglyDB");
    this.version(1).stores({
      tasks: "id, title, due, category, project, priority",
      projects: "id, title, due, category, project, priority",
      categories: "id, title, category",
    });
  }
  deleteCategory(id: ICategory["id"]) {
    return new Promise<[unknown, unknown, unknown]>((resolve, reject) => {
      // Checking whether category id is valid
      this.categories.get(id).then((c) => {
        if (c === undefined) reject("Invalid category id");
      });
      // Extracting all categories inside given category
      this.extractCategories(id)
        .then((cids) => {
          // Fetching all Tasks and Projects which are inside given category
          Promise.all([
            this.projects.where("category").anyOf(cids).toArray(),
            this.tasks.where("category").anyOf(cids).toArray(),
          ])
            .then(([cp, ct]) => {
              const pids = cp.map((p) => p.id);
              // Fetching all Projects which are inside fetched projects
              Promise.all(pids.map((pid) => this.extractProjects(pid)))
                .then((v) => {
                  const flatProjectIds = v.flat();
                  // Fetching all Tasks which are inside projects
                  this.tasks
                    .where("project")
                    .anyOf(flatProjectIds)
                    .toArray()
                    .then((pt) => {
                      // Combining tasks whitin categories with tasks whitin projects
                      const tids = ct.concat(pt).map((t) => t.id);
                      // Deleting all categories, projects and tasks
                      Promise.all([
                        this.tasks.bulkDelete(tids),
                        this.projects.bulkDelete(pids),
                        this.categories.bulkDelete(cids),
                      ])
                        .then(resolve)
                        .catch(reject);
                    })
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }
  extractCategories(id: ICategory["id"]) {
    return new Promise<number[]>((resolve, reject) => {
      // id = 0 is the root category, for all features that aren't categoreised
      id !== 0 &&
        this.categories.get(id).then((c) => {
          if (c === undefined) reject("Invalid category id");
        });
      this.categories
        .where({ category: id })
        .toArray()
        .then((cats) => {
          const instantChildrenIds = cats.map((c) => c.id);
          if (cats.length > 0) {
            Promise.all(
              instantChildrenIds.map((cid) => this.extractCategories(cid)),
            )
              .then((arr) => {
                resolve([id].concat(arr.flat()));
              })
              .catch(reject);
          } else resolve([id]);
        })
        .catch(reject);
    });
  }
  deleteProject(id: IProject["id"]) {
    return new Promise<[unknown, unknown]>((resolve, reject) => {
      this.projects.get(id).then((p) => {
        if (p === undefined) reject("Invalid project id");
      });
      this.extractProjects(id)
        .then((pids) => {
          this.tasks
            .where("project")
            .anyOf(pids)
            .toArray()
            .then((tasks) => {
              const tids = tasks.map((t) => t.id);
              Promise.all([
                this.tasks.bulkDelete(tids),
                this.projects.bulkDelete(pids),
              ])
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }
  extractProjects(id: IProject["id"]) {
    return new Promise<number[]>((resolve, reject) => {
      this.projects.get(id).then((c) => {
        if (c === undefined) reject("Invalid project id");
      });
      this.projects
        .where({ project: id })
        .toArray()
        .then((prjs) => {
          const instantChildrenIds = prjs.map((c) => c.id);
          if (prjs.length > 0) {
            Promise.all(
              instantChildrenIds.map((pid) => this.extractProjects(pid)),
            )
              .then((arr) => {
                resolve([id].concat(arr.flat()));
              })
              .catch(reject);
          } else resolve([id]);
        })
        .catch(reject);
    });
  }
}

export const db = new UglyDB();
console.log(db);

db.on("populate", async (trans) => {
  await trans.table("tasks").bulkAdd(tasks.map(addDueTo));
  await trans.table("projects").bulkAdd(projects);
  await trans.table("categories").bulkAdd(categories);
});

export async function PendingTasksCount(id: IProject["id"]) {
  const pids = await db.extractProjects(id);
  const allTasks = await db.tasks
    .where("project")
    .anyOf(...pids)
    .toArray();
  return [
    allTasks.length,
    allTasks.filter((t) => t.status === false).length,
  ] as const;
}

export async function CategorySummary(id: ICategory["id"] = 0) {
  const cats = await db.extractCategories(id);
  const prjs = await db.projects
    .where("category")
    .anyOf(...cats)
    .toArray();
  const prjIds = prjs.map((p) => p.id);
  const tasks = await db.tasks
    .where("category")
    .anyOf(...cats)
    .or("project")
    .anyOf(...prjIds)
    .toArray();
  return {
    categoriesId: cats,
    projects: prjs,
    tasks,
  };
}

export async function TaskProgressByCategory(id?: ICategory["id"]) {
  const cats = await db.extractCategories(id ?? 0);
  const projects = (
    await db.projects.where("category").anyOf(cats).toArray()
  ).map((p) => p.id);
  const tasks = await db.tasks
    .where("category")
    .anyOf(cats)
    .or("project")
    .anyOf(projects)
    .toArray();
  return [tasks.length, tasks.filter((t) => t.status).length] as const;
}

export async function ProjectProgressByCategory(id?: ICategory["id"]) {
  const cats = await db.extractCategories(id ?? 0);
  const projectsPendings = await Promise.all(
    (await db.projects.where("category").anyOf(cats).toArray()).map((p) =>
      PendingTasksCount(p.id),
    ),
  );

  const all = projectsPendings.map((p) => p[0]).reduce((a, c) => a + c, 0);
  const pending = projectsPendings.map((p) => p[1]).reduce((a, c) => a + c, 0);
  return [all, all - pending] as const;
}

export function addDueTo<T extends ITask | IProject>(f: T): T {
  const due = new Date(f.date);
  due.setUTCHours(f.time.getUTCHours(), f.time.getUTCMinutes(), 0, 0);
  return Object.assign(f, { due });
}

type TableNames = "categories" | "projects" | "tasks";
type Feature = ICategory | IProject | ITask;
export async function addIdTo(
  feat: "categories",
  obj: Partial<ICategory>,
): Promise<ICategory>;
export async function addIdTo(
  feat: "projects",
  obj: Partial<IProject>,
): Promise<IProject>;
export async function addIdTo(
  feat: "tasks",
  obj: Partial<ITask>,
): Promise<ITask>;
export async function addIdTo(feat: TableNames, obj: Partial<Feature>) {
  const id = (await db[feat].count()) + 1;
  return Object.assign(obj, { id });
}
