"use client";
import Icon from "@/app/_components/icon";
import IconButton from "@/app/_components/icon-button";
import { date2display } from "@/app/_components/util";
import { ITask, Priority } from "@/app/_store/data";
import { modals, store } from "@/app/_store/state";
import { effect, useSignalEffect } from "@preact/signals-react";
import Link from "next/link";
import { useState } from "react";

const tasks = store.tasks;

export default function TaskBrowserPage() {
  // const [tasks, setTasks] = useState<ITask[]>([]);
  // useSignalEffect(() => {
  //   console.log("taskSignal Updated");
  //   if (tasks.length == 0) setTasks(tasksSignal.value);
  // });
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] p-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          ></IconButton>
        </div>
        <h1 className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          Tasks
        </h1>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="Sliders"
          ></IconButton>
        </div>
      </header>
      <section className="grid grid-flow-row gap-4 p-4 h-full overflow-auto">
        {tasks.value.map((t, i) => (
          <TaskTicket key={i} {...t} />
        ))}
      </section>
    </>
  );
}

const projects = store.projects.value;
const categorie = store.categories.value;
export function TaskTicket(props: ITask) {
  const project = projects.find((p) => p.id === props.projectId);
  const category = categorie.find((c) => c.id === props.categoryId);
  const [isExpanded, setExpansion] = useState<boolean>(false);
  const [status, setStatus] = useState(
    props.subtasks?.map((st) => st.status) ?? []
  );
  const subtaskProgress =
    status.reduce((p, c) => p + (c ? 1 : 0), 0) / status.length;

  const [progress, setProgress] = useState<number>(
    status.length ? subtaskProgress : props.status ? 1 : 0
  );
  return (
    <article
      className="grid gap-2 bg-gray-100 rounded-3xl p-6"
      onClick={(e) => {
        if (e.target instanceof HTMLInputElement) return;
        setExpansion(!isExpanded);
      }}
    >
      <span className="grid grid-flow-col">
        <h4 className="font-medium">{props.title}</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-8 place-self-end text-primary-700"
          viewBox="0 0 36 36"
          onClick={() => {
            setProgress(progress === 1 ? 0 : 1);
          }}
        >
          <circle
            cx={18}
            cy={18}
            r={15}
            className={
              "transition-all duration-500 " +
              (progress === 1
                ? "stroke-current fill-current"
                : "fill-white stroke-gray-200")
            }
            strokeWidth={4}
          ></circle>
          <circle
            cx={18}
            cy={18}
            r={15}
            className="fill-none rotate-[200deg] origin-center transition-all duration-500 "
            stroke="currentColor"
            strokeWidth={4}
            pathLength={0.99}
            strokeDasharray={"1.01 1"}
            strokeLinecap="round"
            strokeDashoffset={-1 + progress}
          ></circle>
          <polyline
            className="fill-none stroke-white transition-all duration-500 delay-300"
            pathLength={0.99}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1.01 1"
            points="25.05 13.95 15.15 23.85 10.65 19.35"
            strokeDashoffset={progress === 1 ? 0 : -1}
          ></polyline>
        </svg>
      </span>
      <h5 className="text-primary-600 text-base">
        <Link className="underline" href={"../projects/details/" + project?.id}>
          {project?.title}
        </Link>
        {category && project && " • "}
        {category && (
          <Link
            className="underline"
            href={"../categories/details/" + category.id}
          >
            {category.title}
          </Link>
        )}
      </h5>
      <span
        className={
          "grid gap-[inherit] overflow-hidden border-b-2 transition-[grid-template-rows] duration-500 " +
          (isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
        }
      >
        <span className="min-h-0 grid gap-[inherit]">
          <p className="text-primary-700 text-sm">{props.description}</p>
          <menu>
            {props.subtasks?.map((st, i, a) => (
              <li
                key={st.id}
                className="py-1 flex items-center gap-2 text-sm subtask"
              >
                <div className="bg-primary-600 text-primary-50 inline-flex items-center justify-center rounded-full text-xs font-medium size-5 ">
                  {i + 1}
                </div>{" "}
                <p className="flex-grow">{st.title}</p>
                <span className="relative">
                  <input
                    type="checkbox"
                    className=" appearance-none absolute inset-0 w-full h-full"
                    defaultChecked={st.status}
                    onChange={(e) => {
                      setStatus(
                        status.map((s, idx) => {
                          if (idx == i) return e.target.checked;
                          return s;
                        })
                      );
                      onSubtaskStatusChange(props.id, st.id, e.target.checked);
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 place-self-end text-primary-700"
                    viewBox="0 0 20 20"
                  >
                    <circle cx={10} cy={10} r={8} strokeWidth={4}></circle>
                    <circle cx={10} cy={10} r={6} strokeWidth={0}></circle>
                    <polyline
                      pathLength={0.99}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="1.01 1"
                      points="13.92 7.75 8.42 13.25 5.92 10.75"
                    ></polyline>
                  </svg>
                </span>
              </li>
            ))}
          </menu>
        </span>
      </span>
      <div className="text-sm flex w-full gap-1">
        <p className="flex-grow text-xs text-primary-600">
          {date2display(new Date(props.due))}
        </p>
        {props.notification && (
          <Icon
            label="Bell"
            size={14}
            className="bg-gray-200 size-6 rounded-md text-gray-500"
          />
        )}
        {props.subtasks && props.subtasks.length > 0 && (
          <Icon
            label="GitPullRequest"
            size={14}
            className="bg-gray-200 size-6 rounded-md text-gray-500"
          />
        )}

        <p
          className={
            "flex-grow-0 text-center align-middle rounded-md size-6 " +
            (props.priority === "0"
              ? "bg-error-100 text-error-600 "
              : props.priority === "1"
                ? "bg-warning-100 text-warning-600 "
                : "bg-secondary-100 text-secondary-600")
          }
        >
          {Priority[props.priority as string].slice(0, 1)}
        </p>
      </div>
    </article>
  );
}

function onSubtaskStatusChange(
  taskId: string,
  subtaskId: string,
  status: boolean
) {
  const pre = tasks.peek();
  tasks.value = pre.map((t) => {
    if (t.id === taskId)
      return {
        ...t,
        subtasks: t.subtasks?.map((s) => {
          if (s.id == subtaskId) return { ...s, status };
          return s;
        }),
      };
    return t;
  });
}
