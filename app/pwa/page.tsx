"use client";
import Link from "next/link";
import IconButton from "../_components/icon-button";
import TextInput from "../_components/text-input";
import { useState } from "react";
import { ICategory, IProject, ITask } from "../_store/data";
import { useSignalEffect } from "@preact/signals-react";
import { CategoryInfo, PendingTasksCount, store } from "../_store/state";
import TaskTicket from "../_components/task.ticket";

export default function PWAHomePage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  useSignalEffect(() => {
    setCategories(store.categories.value);
    setProjects(store.projects.value);
    setTasks(store.tasks.value);
  });
  return (
    <>
      <search className="sticky top-0 w-full bg-secondary-100 p-4">
        <TextInput className="group text-input-md bg-white text-zinc-600 *:transition-colors">
          <input
            type="text"
            name="title"
            required
            placeholder="Type here..."
            className="peer placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
          />
          <IconButton
            icon="Search"
            className="tap-zinc-50 ico-md group-focus-within:text-zinc-400"
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </TextInput>
      </search>
      <section
        className="sticky w-full bg-secondary-100"
        style={{ top: "4.5rem" }}
      >
        <Link
          href="/pwa/categories"
          className="flex w-full items-center justify-between px-4"
        >
          <h2 className="text-xl font-medium">Categories</h2>
          <span className="whitespace-nowrap">see all</span>
        </Link>
        <div className="flex w-full overflow-x-auto pb-12 pt-4">
          {categories.map((c) => {
            const { projects, tasks } = CategoryInfo(c.id).value;
            return (
              <Link
                href={"/pwa/categories/details/" + c.id}
                key={c.id}
                className="ml-4 flex h-24 flex-shrink-0 flex-col items-center justify-center whitespace-nowrap rounded-xl bg-secondary-600 bg-opacity-15 p-2 [flex-basis:6rem]"
              >
                <p className="h-full font-medium leading-8">{c.title}</p>

                <div className="w-full rounded-lg rounded-b-none bg-error-100 px-2 text-xs text-error-700">
                  {projects} Projects
                </div>

                <div className="w-full rounded-lg rounded-t-none bg-warning-100 px-2 text-xs text-warning-800">
                  {tasks} Tasks
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section
        className="sticky w-full -translate-y-6 text-white"
        style={{ top: "8.5rem" }}
      >
        <Link
          href="/pwa/projects"
          className="flex w-full items-center justify-between rounded-t-3xl bg-primary-800 px-4 pt-2"
        >
          <h2 className="text-xl font-medium">Projects</h2>
          <span className="whitespace-nowrap">see all</span>
        </Link>
        <div className="flex w-full overflow-x-auto bg-primary-800 pb-12 pt-4">
          {projects.map((p) => {
            const [all, pending] = PendingTasksCount(p.id).value;
            return (
              <Link
                href={"/pwa/projects/details/" + p.id}
                key={p.id}
                className="ml-4 flex h-24 flex-shrink-0 flex-col items-center justify-center whitespace-nowrap rounded-xl bg-primary-700 p-2 [flex-basis:6rem]"
              >
                <p className="h-full font-medium leading-8">{p.title}</p>
                <div className="w-full rounded-lg bg-primary-200 px-2 text-xs text-primary-900">
                  {all - pending}/{all} Tasks
                </div>
              </Link>
            );
          })}
          <Link
            href="/pwa/projects/add"
            key="add"
            className="mx-4 flex aspect-square h-24 items-center justify-center rounded-xl border-4 border-primary-700 p-2"
          >
            <div className="relative size-6 before:absolute before:left-1/2 before:block before:h-full before:w-1 before:-translate-x-1/2 before:rounded-sm before:bg-primary-700 after:absolute after:top-1/2 after:block after:h-1 after:w-full after:-translate-y-1/2 after:rounded-sm after:bg-primary-700"></div>
          </Link>
        </div>
      </section>
      <section
        className="sticky max-h-svh w-full -translate-y-12"
        style={{ top: "10.25rem" }}
      >
        <Link
          href="/pwa/tasks"
          className="flex w-full items-center justify-between rounded-t-3xl bg-white px-4 pt-2"
        >
          <h2 className="text-xl font-medium">Tasks</h2>
          <span className="whitespace-nowrap">see all</span>
        </Link>
        <div className="sticky w-full bg-white p-4">
          {tasks.map((t) => (
            <span key={t.id} className="sticky" style={{ top: "4.5rem" }}>
              <TaskTicket {...t} />
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
