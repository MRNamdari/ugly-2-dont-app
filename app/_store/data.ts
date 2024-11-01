export type ProjectId = string & `p${number}`;

export type IProject = {
  title: string;
  id: ProjectId;
  due: string;
  description?: string;
  priority?: string;
  categoryId?: CategoryId;
  projectId?: ProjectId;
};

export type IProjectFormData = Partial<{
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  priority: string;
  project: string;
  category: string;
  reminder: string;
}>;

export type CategoryId = string & `c${number}`;
export type ICategory = {
  title: string;
  id: CategoryId;
  categoryId?: CategoryId;
};

export type TaskId = string & `t${number}`;
export type ITask = {
  title: string;
  id: TaskId;
  status: boolean;
  description?: string;
  subtasks?: ISubTask[];
  projectId?: ProjectId;
  categoryId?: CategoryId;
  due: string;
  notification?: string;
  priority?: string;
};
export type ITaskFormData = Partial<
  {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    project: string;
    category: string;
    reminder: string;
    priority: string;
  } & { [K in `st${string}` | `ss${string}`]: string }
>;

export type ISubTask = { title: string; id: string; status: boolean };

export enum IPriority {
  High = "2",
  Medium = "1",
  Low = "0",
}

export const Priority = {
  "0": "High",
  "1": "Medium",
  "2": "Low",
  High: "2",
  Medium: "1",
  Low: "0",
} as Record<string, string>;

export const tasks: ITask[] = [
    {
      title: "Buy groceries",
      id: "t1",
      status: false,
      description: "Milk, eggs, bread, cheese",
      projectId: "p1",
      categoryId: "c1",
      due: "2023-10-13T09:00:00",
      notification: "2023-08-25T18:00:00",
      priority: "2",
    },
    {
      title: "Call the doctor",
      id: "t2",
      status: true,
      description: "Schedule an appointment for next week",
      projectId: "p2",
      categoryId: "c2",
      due: "2023-08-28T10:00:00",
      priority: "1",
    },
    {
      title: "Write a blog post",
      id: "t3",
      status: false,
      description: "Write a blog post about my recent vacation",
      subtasks: [
        { title: "Do research", id: "1", status: true },
        { title: "Write the first draft", id: "2", status: false },
        { title: "Edit and proofread", id: "3", status: false },
      ],
      projectId: "p3",
      categoryId: "c3",
      due: "2023-08-30T12:00:00",
      priority: "0",
    },
    {
      title: "Meet with client",
      id: "t4",
      status: false,
      description: "Discuss the new project",
      projectId: "p2",
      categoryId: "c2",
      due: "2023-08-29T14:00:00",
      notification: "2023-08-28T12:00:00",
      priority: "2",
    },
    {
      title: "Go to the gym",
      id: "t5",
      status: true,
      description: "Work out for 30 minutes",
      categoryId: "c1",
      due: "2023-08-27T18:00:00",
      priority: "1",
    },
    {
      title: "Plan a vacation",
      id: "t6",
      status: true,
      description: "Choose a destination and book flights and hotels",
      subtasks: [
        { title: "Research destinations", id: "104", status: false },
        { title: "Book flights", id: "105", status: true },
        { title: "Book hotels", id: "106", status: true },
      ],
      categoryId: "c3",
      due: "2023-09-15T12:00:00",
      priority: "0",
    },
    {
      title: "Learn a new language",
      id: "t7",
      status: false,
      description: "Start learning Spanish",
      categoryId: "c1",
      due: "2023-09-30T12:00:00",
      priority: "1",
    },
    {
      title: "Read a book",
      id: "t8",
      status: true,
      description: "Read 'The Alchemist' by Paulo Coelho",
      categoryId: "c3",
      due: "2023-09-01T12:00:00",
      priority: "0",
    },
    {
      title: "Start a blog",
      id: "t9",
      status: false,
      description: "Write about my thoughts and experiences",
      categoryId: "c3",
      due: "2023-10-01T12:00:00",
      priority: "2",
    },
    {
      title: "Learn to code",
      id: "t10",
      status: true,
      description: "Start learning Python",
      categoryId: "c1",
      due: "2023-12-01T12:00:00",
      priority: "1",
    },
    {
      title: "Get a promotion",
      id: "t11",
      status: false,
      description: "Work hard and impress my boss",
      categoryId: "c2",
      due: "2024-01-01T12:00:00",
      priority: "2",
    },
    {
      title: "Start a business",
      id: "t12",
      status: true,
      description: "Come up with a business idea and start working on it",
      categoryId: "c1",
      due: "2024-03-01T12:00:00",
      priority: "0",
    },
    {
      title: "Travel the world",
      id: "t13",
      status: false,
      description: "Visit all seven continents",
      categoryId: "c3",
      due: "2025-01-01T12:00:00",
      priority: "1",
    },
    {
      title: "Make a difference in the world",
      id: "t14",
      status: true,
      description: "Volunteer my time to help others",
      categoryId: "c1",
      due: "2025-12-31T12:00:00",
      priority: "2",
    },
    {
      title: "Buy PC",
      id: "t15",
      status: false,
      description: "Monitor, Mice, Keyboard, Speaker",
      due: "2023-09-26T09:00:00",
      notification: "2023-09-25T18:00:00",
      priority: "2",
    },
  ],
  projects: IProject[] = [
    {
      title: "Groceries",
      id: "p1",
      projectId: "p5",
      categoryId: "c1",
      due: "2024-11-01T12:00:00",
      priority: "2",
    },
    {
      title: "Doctor's appointments",
      id: "p2",

      categoryId: "c2",
      due: "2023-08-28T10:00:00",
      priority: "1",
    },
    {
      title: "Blog posts",
      id: "p3",
      projectId: "p4",
      categoryId: "c3",
      due: "2023-08-26T09:00:00",
      priority: "0",
    },
    {
      title: "Work",
      id: "p4",
      categoryId: "c2",
      priority: "2",
      due: "2023-08-26T09:00:00",
    },
    {
      title: "Personal",
      id: "p5",
      due: "2023-08-26T09:00:00",
      categoryId: "c1",
      priority: "1",
    },
    {
      title: "Creative",
      id: "p6",
      due: "2023-08-26T09:00:00",
      projectId: "p5",
      categoryId: "c3",
      priority: "0",
    },
  ],
  categories: ICategory[] = [
    { title: "Personal", id: "c1" },
    { title: "Work", id: "c2" },
    { title: "Creative", id: "c3" },
    { title: "Health", id: "c4", categoryId: "c1" },
    { title: "Finances", id: "c5", categoryId: "c1" },
    { title: "Relationships", id: "c6", categoryId: "c1" },
    { title: "Hobbies", id: "c7", categoryId: "c1" },
    { title: "Spirituality", id: "c8", categoryId: "c1" },
    { title: "Projects", id: "c9", categoryId: "c2" },
    { title: "Teamwork", id: "c10", categoryId: "c2" },
    { title: "Communication", id: "c11", categoryId: "c2" },
    { title: "Problem solving", id: "c12", categoryId: "c2" },
    { title: "Leadership", id: "c13", categoryId: "c2" },
  ];
