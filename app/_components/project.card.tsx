"use client";

import Link from "next/link";
import { IProject, Priority } from "../_store/data";
import { modals, PendingTasksCount, store } from "../_store/state";
import IconButton from "./icon-button";
import { motion, PanInfo } from "framer-motion";
import { useState, MouseEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { DueTime, PendingTasks, ProgressPie } from "./project.ticket";
import Button from "./button";

const projects = store.projects;
const categories = store.categories.value;

export default function ProjectCard(props: IProject) {
  const router = useRouter();
  const menu = useRef<HTMLDialogElement>(null);
  const project = projects.value.find((p) => p.id === props.projectId);
  const [allTasks, pendingTasks] = PendingTasksCount(props.id);
  const progress =
    allTasks === 0 ? 0 : ((allTasks - pendingTasks) / allTasks) * 100;
  const category = categories.find((c) => c.id === props.categoryId);

  function onDelete() {
    modals.delete.message.value = `Sure wanna delete “${props.title}” project?`;
    const deleteModal = document.getElementById("delete") as HTMLDialogElement;
    deleteModal.onclose = (e) => {
      if (deleteModal.returnValue === "true") {
        projects.value = projects.value.filter((p) => p.id !== props.id);
      }
    };
    menu.current?.close();
    deleteModal.showModal();
  }
  return (
    <motion.article
      id={props.id}
      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
      className="relative mb-4"
    >
      <div className="rounded-3xl p-6 pt-2 aria-selected:bg-secondary-50 bg-secondary-100">
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
        {props.description && (
          <p className="text-justify text-sm py-2">{props.description}</p>
        )}
        <div className="flex justify-between items-center text-primary-700 pt-2">
          <ProgressPie {...{ progress }} />
          <PendingTasks pending={pendingTasks} />
          <DueTime due={new Date(props.due)} />
        </div>
      </div>
    </motion.article>
  );
}
