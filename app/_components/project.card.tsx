"use client";

import Link from "next/link";
import { IProject, Priority } from "../_store/data";
import { modals, PendingTasksCount, store } from "../_store/state";
import IconButton from "./icon-button";
import {
  motion,
  MotionValue,
  PanInfo,
  TargetAndTransition,
} from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DueTime, PendingTasks, ProgressPie } from "./project.ticket";
import Button from "./button";
import { ProjectId } from "./util";
import { useSignalEffect } from "@preact/signals-react";

const projects = store.projects;
const categories = store.categories.value;
type ProjectCardProps = IProject & {
  x?: MotionValue<number>;
  onDrag?: (ev: any, dir: 1 | -1) => void;
  onDelete?: () => void;
  animate?: TargetAndTransition;
};
export default function ProjectCard(props: ProjectCardProps) {
  const router = useRouter();
  const menu = useRef<HTMLDialogElement>(null);
  const project = projects.value.find((p) => p.id === props.projectId);
  const [{ allTasks, pendingTasks }, setPendingTasksCount] = useState({
    allTasks: 0,
    pendingTasks: 0,
  });

  useSignalEffect(() => {
    const [allTasks, pendingTasks] = PendingTasksCount(props.id).value;
    setPendingTasksCount({ allTasks, pendingTasks });
  });

  const progress =
    allTasks === 0 ? 0 : ((allTasks - pendingTasks) / allTasks) * 100;
  const category = categories.find((c) => c.id === props.categoryId);

  function onDelete() {
    modals.delete.message.value = `Sure wanna delete “${props.title}” project?`;
    const deleteModal = document.getElementById("delete") as HTMLDialogElement;
    deleteModal.onclose = (e) => {
      if (deleteModal.returnValue === "true") {
        props.onDelete && props.onDelete();
        projects.value = projects.value.filter((p) => p.id !== props.id);
      }
    };
    menu.current?.close();
    deleteModal.showModal();
  }
  return (
    <motion.article
      id={props.id}
      exit={{ width: 0, opacity: 0, marginBottom: 0 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x: props.x }}
      animate={props.animate}
      onDragEnd={(e, info) => {
        if (!props.onDrag) return;
        const { width } = (e.target as HTMLElement).getBoundingClientRect();
        if (Math.abs(info.offset.x) > width / 3) {
          if (info.offset.x > 0) props.onDrag(e, -1);
          if (info.offset.x < 0) props.onDrag(e, 1);
        }
      }}
      className="relative w-[calc(100%-2rem)] mx-2 first:ml-4 last:mr-4 h-full inline-flex flex-col whitespace-normal rounded-3xl p-6 pt-2 bg-secondary-100"
    >
      <span className="grid grid-cols-[auto_2rem]">
        <h4 className="font-medium text-lg self-center">{props.title}</h4>
        <span className="relative">
          <IconButton
            icon="MoreHorizontal"
            className="ico-md tap-secondary-200 text-primary-700"
            onClick={() => {
              menu.current?.showModal();
            }}
          />
          <dialog
            ref={menu}
            className={
              "popup-modal bg-transparent max-w-screen-sm w-5/6 overflow-hidden"
            }
            onClick={(e) => {
              const rect = menu.current?.getBoundingClientRect();
              if (!rect) return;
              const isInDialog =
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width;
              if (!isInDialog) {
                menu.current?.close();
              }
            }}
          >
            <Button
              leadingIcon="Trash"
              onClick={onDelete}
              className="btn-md bg-error-100 tap-error-200 text-error-600 rounded-b-none"
            >
              Delete “{props.title}”
            </Button>

            <Button
              leadingIcon="Edit2"
              onClick={() => router.push("/pwa/projects/edit/" + props.id)}
              className="btn-md bg-warning-100 tap-warning-200 text-warning-700 rounded-t-none"
            >
              Edit “{props.title}”
            </Button>
          </dialog>
        </span>
      </span>
      <span>
        <h5 className="text-primary-600 text-base inline">
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
        {props.priority && (
          <label
            className={
              "text-xs px-1 rounded-sm float-end " +
              (props.priority === "0"
                ? "bg-error-100 text-error-600 "
                : props.priority === "1"
                  ? "bg-warning-100 text-warning-600 "
                  : "bg-secondary-200 text-secondary-800")
            }
          >
            {Priority[props.priority].toUpperCase()}
          </label>
        )}
      </span>
      {props.description ? (
        <p className="text-justify text-sm py-2 text-ellipsis overflow-auto">
          {props.description}
        </p>
      ) : (
        <div className="h-full w-full"></div>
      )}
      <div className="justify-self-end flex justify-between items-center text-primary-700 pt-2">
        <ProgressPie {...{ progress }} />
        <PendingTasks pending={pendingTasks} />
        <DueTime due={new Date(props.due)} />
      </div>
    </motion.article>
  );
}
