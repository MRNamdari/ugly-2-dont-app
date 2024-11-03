"use client";

import Link from "next/link";
import { ICategory, IProject } from "../_store/data";
import Icon from "./icon";
import {
  isSelectionStarted,
  modals,
  PendingTasksCount,
  store,
} from "../_store/state";
import IconButton from "./icon-button";
import { motion, PanInfo } from "framer-motion";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

const tasks = store.tasks;
const projects = store.projects;
const categories = store.categories.value;
const selection = store.selection;

export default function ProjectTicket(props: IProject) {
  const router = useRouter();
  const project = projects.value.find((p) => p.id === props.projectId);
  const [isSelected, setSelection] = useState<boolean>();
  const [allTasks, pendingTasks] = PendingTasksCount(props.id);
  const progress =
    allTasks === 0 ? 0 : ((allTasks - pendingTasks) / allTasks) * 100;
  const category = categories.find((c) => c.id === props.categoryId);
  function ContextMenuHandler(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSelection(true);
    selection.value = [...selection.value, props.id];
  }
  function DragEndHandler(e: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > 90)
      info.offset.x > 0
        ? onDelete()
        : router.push(`/pwa/projects/edit/${props.id}`);
  }
  function onDelete() {
    modals.delete.message.value = `Sure wanna delete “${props.title}” project?`;
    const deleteModal = document.getElementById("delete") as HTMLDialogElement;
    deleteModal.onclose = (e) => {
      if (deleteModal.returnValue === "true") {
        projects.value = projects.value.filter((p) => p.id !== props.id);
      }
    };
    deleteModal.showModal();
  }
  return (
    <motion.article
      id={props.id}
      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
      className="relative mb-4"
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
        className="rounded-3xl p-6 pt-2 aria-selected:bg-secondary-50 bg-gray-100"
        aria-selected={isSelected}
        onClick={() => {
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
        }}
        onContextMenu={ContextMenuHandler}
        onDragEnd={DragEndHandler}
      >
        <span className="grid grid-cols-[auto_2rem]">
          <h4 className="font-medium text-lg self-center">{props.title}</h4>
          <Link href={"/pwa/projects/details/" + props.id}>
            <IconButton
              icon="ExternalLink"
              className="ico-md tap-gray-200 text-primary-700"
            />
          </Link>
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
        <div className="flex justify-between items-center text-primary-700 pt-2">
          <ProgressPie {...{ progress }} />
          <PendingTasks pending={pendingTasks} />
          <DueTime due={new Date(props.due)} />
        </div>
      </motion.div>
    </motion.article>
  );
}

export function DueTime(props: { due: Date }) {
  if (!props.due) return null;
  const RemainedInSec = (props.due.getTime() - Date.now()) / 1000;
  const UnitArray = ["Second", "Minute", "Hour", "Day", "Month", "Year"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DividedBy = [
    1,
    60,
    60 ** 2,
    24 * 60 ** 2,
    30 * 24 * 60 ** 2,
    365 * 24 * 60 ** 2,
  ];
  const UnitFilter: ((r: number) => boolean)[] = [
    (r) => r < 61,
    (r) => r < 61,
    (r) => r < 25,
    (r) => r < 99,
    (r) => r < 13,
    (r) => true,
  ];

  if (RemainedInSec > 0) {
    const RemainedInUnit = Array.from(DividedBy, (d) =>
      Math.floor(RemainedInSec / d)
    );
    const index = RemainedInUnit.findIndex((r, i) => UnitFilter[i](r));
    const count = RemainedInUnit[index];
    const unit = count > 1 ? UnitArray[index] + "s" : UnitArray[index];
    return (
      <div className="grid grid-cols-2">
        <span className="row-span-2 text-[2rem] leading-8 place-self-end pr-1">
          {count}
        </span>
        <div className="row-span-1 text-xs leading-3 self-center">
          {unit} To
        </div>
        <div className="row-span-1 text-xs leading-3">Deadline</div>
      </div>
    );
  } else {
    const day = props.due.getDate();
    const month = monthNames[props.due.getMonth()];
    const year = props.due.getFullYear();
    return (
      <div className="grid grid-cols-2">
        <span className="row-span-2 text-[2rem] leading-8 place-self-end pr-1">
          {day}
        </span>
        <span className="row-span-1 text-xs leading-3 self-center">
          {month}
        </span>
        <span className="row-span-1 text-xs leading-3">{year}</span>
      </div>
    );
  }
}

export function PendingTasks(props: { pending: number }) {
  return (
    <div className="grid grid-cols-2">
      <span className="row-span-2 text-[2rem] leading-8 place-self-end pr-1">
        {props.pending}
      </span>
      <div className="row-span-1 text-xs leading-3 self-center">Pending</div>
      <div className="row-span-1 text-xs leading-3">Tasks</div>
    </div>
  );
}

export function ProgressPie(props: { progress: number }) {
  return (
    <div className="flex items-end">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        className="mr-1 place-self-center"
      >
        <circle
          cx="11"
          cy="11"
          r="5.5"
          className="-rotate-90 origin-center"
          pathLength={100.01}
          strokeWidth={11}
          strokeDasharray={`${props.progress} ${100 - props.progress}`}
        ></circle>
        {props.progress === 100 ? (
          <polyline
            pathLength="1"
            strokeDasharray="1 1"
            stroke="var(--clr-quinary)"
            strokeWidth={2}
            strokeLinecap="round"
            points="6.1 10.9 9.1 13.9 15.7 7.3"
          ></polyline>
        ) : null}
      </svg>
      <div className="text-3xl leading-8">{props.progress}</div>%
    </div>
  );
}
