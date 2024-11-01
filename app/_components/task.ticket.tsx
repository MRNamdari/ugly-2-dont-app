import Icon from "@/app/_components/icon";
import { date2display } from "@/app/_components/util";
import { ISubTask, ITask, Priority } from "@/app/_store/data";
import { isSelectionStarted, modals, store } from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { motion, PanInfo } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

const tasks = store.tasks;
const projects = store.projects.value;
const categories = store.categories.value;
const selection = store.selection;

export default function TaskTicket(props: ITask) {
  const router = useRouter();
  const project = projects.find((p) => p.id === props.projectId);
  const category = categories.find((c) => c.id === props.categoryId);
  const [isExpanded, setExpansion] = useState<boolean>(false);
  const [isSelected, setSelection] = useState<boolean>(
    selection.value.includes(props.id)
  );
  const hasSubtasks =
    Array.isArray(props.subtasks) && props.subtasks.length > 0;
  const [status, setStatus] = useState(
    props.subtasks?.map((st) => st.status) ?? []
  );
  const subtaskProgress =
    status.reduce((p, c) => p + (c ? 1 : 0), 0) / status.length;
  const [isChecked, setCheckbox] = useState<boolean>(
    hasSubtasks ? props.status : subtaskProgress == 1
  );
  const progress = hasSubtasks ? subtaskProgress : isChecked ? 1 : 0;

  const clickEvent = useRef({ timeStamp: 0 });

  function MainCheckboxChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const chk = e.target.checked;
    if (hasSubtasks) {
      setStatus(Array.from(status).fill(chk));
      tasks.value = tasks.value.map((t) => {
        if (t.id == props.id)
          return {
            ...props,
            status: chk,
            subtasks: props.subtasks?.map((st) => ({
              ...st,
              status: chk,
            })),
          };
        return t;
      });
    } else {
      tasks.value = tasks.value.map((t) => {
        if (t.id == props.id)
          return {
            ...props,
            status: chk,
          };
        return t;
      });
    }
    setCheckbox(chk);
  }
  function SubtaskChangeHandlerMapper(st: ISubTask, i: number) {
    return function SubtaskCheckboxChangeHandler(
      e: ChangeEvent<HTMLInputElement>
    ) {
      setStatus(
        status.map((s, idx) => {
          if (idx == i) return e.target.checked;
          return s;
        })
      );
      onSubtaskStatusChange(props.id, st.id, e.target.checked);
    };
  }
  function ClickHandler(e: MouseEvent<HTMLDivElement>) {
    if (isSelectionStarted.value) {
      if (clickEvent.current !== null) {
        if (e.timeStamp - clickEvent.current.timeStamp < 250) {
          setExpansion(!isExpanded);
          return;
        } else {
          clickEvent.current.timeStamp = e.timeStamp;
          new Promise((resolve) => {
            setTimeout(() => resolve((clickEvent.current.timeStamp = 0)), 255);
          });
        }
      }
    }
    if (isSelectionStarted.value) {
      if (isSelected) {
        selection.value = selection.value.filter((id) => id !== props.id);
        setSelection(false);
      } else {
        selection.value = [...selection.value, props.id];
        setSelection(true);
      }
      return;
    }
    if (e.target instanceof HTMLInputElement) return;
    setExpansion(!isExpanded);
  }
  function DoubleClickHandler(e: MouseEvent<HTMLDivElement>) {
    if (isSelectionStarted.value) {
      if (e.target instanceof HTMLInputElement) return;
      setExpansion(!isExpanded);
    }
  }
  function ContextMenuHandler(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSelection(true);
    selection.value = [...selection.value, props.id];
  }
  function DragEndHandler(e: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > 90)
      info.offset.x > 0
        ? onDelete()
        : router.push(`/pwa/tasks/edit/${props.id}`);
  }
  function onDelete() {
    modals.delete.message.value = `Sure wanna delete “${props.title}” task?`;
    const deleteModal = document.getElementById("delete") as HTMLDialogElement;
    deleteModal.onclose = (e) => {
      if (deleteModal.returnValue === "true") {
        tasks.value = tasks.value.filter((t) => t.id !== props.id);
      }
    };
    deleteModal.showModal();
  }
  return (
    <motion.article
      className="relative mb-4"
      id={props.id}
      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
    >
      <div className="absolute h-5/6 w-1/2 left-2 top-1/2 -translate-y-1/2 -z-10 rounded-l-2xl bg-error-100  flex justify-start items-center p-4">
        <Icon label="Trash" size={24} className="size-6 text-error-500" />
      </div>
      <div className="absolute h-5/6 w-1/2 right-2 top-1/2 -translate-y-1/2 -z-10 rounded-r-2xl bg-warning-100  flex justify-end items-center p-4">
        <Icon label="Edit" size={24} className="size-6 text-warning-600" />
      </div>
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragTransition={{ bounceStiffness: 400 }}
        aria-selected={isSelected}
        className="grid gap-2 rounded-3xl p-6 aria-selected:bg-secondary-50 bg-gray-100"
        onClick={ClickHandler}
        onDoubleClick={DoubleClickHandler}
        onContextMenu={ContextMenuHandler}
        onDragEnd={DragEndHandler}
      >
        <span className="grid grid-cols-[auto_2rem]">
          <h4 className="font-medium">{props.title}</h4>
          <span className="relative">
            <input
              type="checkbox"
              className=" appearance-none absolute inset-0 w-full h-full"
              defaultChecked={isChecked}
              onChange={MainCheckboxChangeHandler}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8 place-self-end text-primary-700"
              viewBox="0 0 36 36"
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
        </span>
        <h5 className="text-primary-600 text-base">
          <Link
            className="underline"
            href={"../projects/details/" + project?.id}
          >
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
                  </div>
                  <p className="flex-grow">{st.title}</p>
                  <span className="relative">
                    <input
                      type="checkbox"
                      className=" appearance-none absolute inset-0 w-full h-full"
                      defaultChecked={status[i]}
                      onChange={SubtaskChangeHandlerMapper(st, i)}
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
      </motion.div>
    </motion.article>
  );
}

function onSubtaskStatusChange(
  taskId: string,
  subtaskId: string,
  status: boolean
) {
  const pre = tasks.peek();

  tasks.value = pre.map((t) => {
    if (t.id === taskId) {
      const subtasks = t.subtasks?.map((s) => {
        if (s.id == subtaskId) return { ...s, status };
        return s;
      });
      return {
        ...t,
        status: subtasks?.every((s) => s.status) ?? t.status,
        subtasks,
      };
    }
    return t;
  });
}
