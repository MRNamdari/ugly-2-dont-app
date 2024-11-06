"use client";

import Link from "next/link";
import { IProject, Priority } from "../_store/data";
import {
  modals,
  PendingTasksCount,
  RemoveProjectById,
  store,
} from "../_store/state";
import IconButton from "./icon-button";
import {
  motion,
  MotionValue,
  PanInfo,
  TargetAndTransition,
} from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DueTime, PendingTasks } from "./project.ticket";
import Button from "./button";
import { ProjectId } from "./util";
import { useSignalEffect } from "@preact/signals-react";
import ProgressPie from "./progress-pie";

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
    // const [allTasks, pendingTasks] = PendingTasksCount(props.id).value;
    // setPendingTasksCount({ allTasks, pendingTasks });
    new Promise<number[]>((resolve) =>
      resolve(PendingTasksCount(props.id).value),
    ).then(([allTasks, pendingTasks]) =>
      setPendingTasksCount({ allTasks, pendingTasks }),
    );
  });

  const progress =
    allTasks === 0 ? 0 : ((allTasks - pendingTasks) / allTasks) * 100;
  const category = categories.find((c) => c.id === props.categoryId);

  function onDelete() {
    modals.delete.message.value = `Sure wanna delete “${props.title}” and all its tasks and projects?`;
    const deleteModal = document.getElementById("delete") as HTMLDialogElement;
    deleteModal.onclose = (e) => {
      if (deleteModal.returnValue === "true") {
        props.onDelete && props.onDelete();
        RemoveProjectById(props.id);
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
      className="relative mx-2 inline-flex h-full w-[calc(100%-2rem)] flex-col whitespace-normal rounded-3xl bg-secondary-100 p-6 pt-2 first:ml-4 last:mr-4"
    >
      <span className="grid grid-cols-[auto_2rem]">
        <h4 className="self-center text-lg font-medium">{props.title}</h4>
        <span className="relative">
          <IconButton
            icon="MoreHorizontal"
            className="tap-secondary-200 ico-md text-primary-700"
            onClick={() => {
              menu.current?.showModal();
            }}
          />
          <dialog
            ref={menu}
            className={
              "popup-modal w-5/6 max-w-screen-sm overflow-hidden bg-transparent"
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
              className="tap-error-200 btn-md rounded-b-none bg-error-100 text-error-600"
            >
              Delete “{props.title}”
            </Button>

            <Button
              leadingIcon="Edit2"
              onClick={() => {
                menu.current?.close();
                router.push("/pwa/projects/edit/" + props.id);
              }}
              className="tap-warning-200 btn-md rounded-t-none bg-warning-100 text-warning-700"
            >
              Edit “{props.title}”
            </Button>
          </dialog>
        </span>
      </span>
      <span>
        <h5 className="inline text-base text-primary-600">
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
        {props.priority && (
          <label
            className={
              "float-end rounded-sm px-1 text-xs " +
              (props.priority === "0"
                ? "bg-error-100 text-error-600"
                : props.priority === "1"
                  ? "bg-warning-100 text-warning-600"
                  : "bg-secondary-200 text-secondary-800")
            }
          >
            {Priority[props.priority].toUpperCase()}
          </label>
        )}
      </span>
      {props.description ? (
        <p className="overflow-auto text-ellipsis py-2 text-justify text-sm">
          {props.description}
        </p>
      ) : (
        <div className="h-full w-full"></div>
      )}
      <div className="flex items-center justify-between justify-self-end pt-2 text-primary-700">
        <ProgressPie {...{ progress }} />
        <PendingTasks pending={pendingTasks} />
        <DueTime due={new Date(props.due)} />
      </div>
    </motion.article>
  );
}
