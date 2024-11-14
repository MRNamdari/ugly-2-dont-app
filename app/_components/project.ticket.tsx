"use client";

import Link from "next/link";
import { IProject, PendingTasksCount } from "../_store/db";
import Icon from "./icon";
import {
  AddToSelection,
  isSelectionStarted,
  RemoveFromSelection,
  store,
} from "../_store/state";
import IconButton from "./icon-button";
import { motion, PanInfo } from "framer-motion";
import { useState, MouseEvent, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSignalEffect } from "@preact/signals-react";
import ProgressPie from "./progress-pie";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../_store/db";
import { DeleteContext } from "./delete.modal";

const selection = store.selection;

type ProjectTicketProps = IProject & {
  onOpen?: (e: MouseEvent, id: IProject["id"]) => void;
};
export default function ProjectTicket(props: ProjectTicketProps) {
  const router = useRouter();

  const deleteModal = useContext(DeleteContext);
  const project = useLiveQuery(async () => {
    if (props.project) return await db.projects.get(props.project);
  });
  const category = useLiveQuery(async () => {
    if (props.category) return await db.categories.get(props.category);
  });
  const [allTasks, pendingTasks] = useLiveQuery(async () => {
    return await PendingTasksCount(props.id);
  }) ?? [0, 0];

  const [isSelected, setSelection] = useState<boolean>();

  useSignalEffect(() => {
    if (selection.project.value.includes(props.id)) setSelection(true);
    else setSelection(false);
  });
  const dragEnded = useRef<{ info: PanInfo | null }>({ info: null });
  const progress =
    allTasks === 0 ? 100 : ((allTasks - pendingTasks) / allTasks) * 100;

  function ContextMenuHandler(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSelection(true);
    AddToSelection("project", props.id);
  }
  function DragEndHandler(e: any, info: PanInfo) {
    dragEnded.current.info = info;
  }
  function DragTransitionEndHandler() {
    const info = dragEnded.current.info;
    if (info && Math.abs(info.offset.x) > 90)
      info.offset.x > 0
        ? onDelete()
        : router.push(`/pwa/tasks/edit/${props.id}`);
  }
  function onDelete() {
    deleteModal.onClose = async (value) => {
      if (value === "true") {
        await db.deleteProject(props.id);
      }
    };
    deleteModal.showModal(
      `Sure wanna delete “${props.title}” and all its tasks and projects?`,
    );
  }
  return (
    <motion.article
      id={"p" + props.id}
      initial={{ opacity: 0, marginBottom: 0 }}
      animate={{ opacity: 1, marginBottom: "1rem" }}
      exit={{ opacity: 0, marginBottom: 0 }}
      className="relative mb-4"
    >
      <div className="absolute left-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-start rounded-l-2xl bg-error-100 p-4">
        <Icon label="Trash" size={24} className="size-6 text-error-500" />
      </div>
      <div className="absolute right-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-end rounded-r-2xl bg-warning-100 p-4">
        <Icon label="Edit" size={24} className="size-6 text-warning-600" />
      </div>
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragTransition={{ bounceStiffness: 400 }}
        className="rounded-3xl bg-gray-100 p-6 pt-2 aria-selected:bg-secondary-50"
        aria-selected={isSelected}
        onClick={() => {
          if (isSelectionStarted.value) {
            if (isSelected) {
              RemoveFromSelection("project", props.id);
              setSelection(false);
            } else {
              AddToSelection("project", props.id);
              setSelection(true);
            }
            return;
          }
        }}
        onContextMenu={ContextMenuHandler}
        onDragEnd={DragEndHandler}
        onDragTransitionEnd={DragTransitionEndHandler}
      >
        <span className="grid grid-cols-[auto_2rem]">
          <h4 className="self-center text-lg font-medium">{props.title}</h4>
          <Link
            href={"/pwa/projects/details/" + props.id}
            onClick={(e) => props.onOpen && props.onOpen(e, props.id)}
          >
            <IconButton
              icon="ExternalLink"
              className="tap-gray-200 ico-md text-primary-700"
            />
          </Link>
        </span>
        <h5 className="text-base text-primary-600">
          {project && (
            <Link
              className="underline"
              href={"/pwa/projects/details/" + project.id}
            >
              {project.title}
            </Link>
          )}
          {category && project && " • "}
          {category && (
            <Link
              className="underline"
              href={"/pwa/categories/details/" + category.id}
            >
              {category.title}
            </Link>
          )}
        </h5>
        <div className="flex items-center justify-between pt-2 text-primary-700">
          <ProgressPie {...{ progress }} />
          <PendingTasks pending={pendingTasks} />
          <DueTime date={props.date} time={props.time} />
        </div>
      </motion.div>
    </motion.article>
  );
}

export function DueTime(props: { date: Date; time: Date }) {
  props.date.setHours(
    props.time.getUTCHours(),
    props.time.getUTCMinutes(),
    0,
    0,
  );
  if (!props.date) return null;
  const RemainedInSec = (props.date.getTime() - Date.now()) / 1000;
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
      Math.floor(RemainedInSec / d),
    );
    const index = RemainedInUnit.findIndex((r, i) => UnitFilter[i](r));
    const count = RemainedInUnit[index];
    const unit = count > 1 ? UnitArray[index] + "s" : UnitArray[index];
    return (
      <div className="grid grid-cols-2">
        <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
          {count}
        </span>
        <div className="row-span-1 self-center whitespace-nowrap text-xs leading-3">
          {unit} To
        </div>
        <div className="row-span-1 text-xs leading-3">Deadline</div>
      </div>
    );
  } else {
    const day = props.date.getDate();
    const month = monthNames[props.date.getMonth()];
    const year = props.date.getFullYear();
    return (
      <div className="grid grid-cols-2">
        <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
          {day}
        </span>
        <span className="row-span-1 self-center text-xs leading-3">
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
      <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
        {props.pending}
      </span>
      <div className="row-span-1 self-center text-xs leading-3">Pending</div>
      <div className="row-span-1 text-xs leading-3">Tasks</div>
    </div>
  );
}
