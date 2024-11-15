"use client";
import Link from "next/link";
import IconButton from "../_components/icon-button";
import TextInput from "../_components/text-input";

import TaskTicket from "../_components/task.ticket";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import { CategorySummary, db, PendingTasksCount } from "../_store/db";
import { store } from "../_store/state";
import { ITask } from "../_store/db";

export default function PWAHomePage() {
  const tasks = useLiveQuery(
    async () =>
      await db.tasks.where("due").aboveOrEqual(new Date()).sortBy("due"),
  );
  // const tasks: ITask[] = [];
  store.view.task.value = tasks?.map((t) => t.id) ?? [];
  const projects = useLiveQuery(async () => {
    const p = await db.projects.toArray();
    return await Promise.all(
      p.map(async (p) => [p, await PendingTasksCount(p.id)] as const),
    );
  });

  const categories = useLiveQuery(async () => {
    const c = await db.categories.toArray();
    return await Promise.all(
      c.map(async (c) => [c, await CategorySummary(c.id)] as const),
    );
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
          {categories?.map(([c, { projects, tasks }]) => {
            return (
              <Link
                href={"/pwa/categories/details/" + c.id}
                key={c.id}
                className="ml-4 flex h-24 flex-shrink-0 flex-col items-center justify-center whitespace-nowrap rounded-xl bg-secondary-600 bg-opacity-15 p-2 [flex-basis:6rem]"
              >
                <p className="h-full font-medium leading-8">{c.title}</p>

                <div className="w-full rounded-lg rounded-b-none bg-error-100 px-2 text-xs text-error-700">
                  {projects.length} Projects
                </div>

                <div className="w-full rounded-lg rounded-t-none bg-warning-100 px-2 text-xs text-warning-800">
                  {tasks.length} Tasks
                </div>
              </Link>
            );
          })}
          <Link
            href="/pwa/categories"
            key="add"
            className="mx-4 flex aspect-square h-24 items-center justify-center rounded-xl border-4 border-secondary-600 p-2 opacity-15"
          >
            <div className="relative size-6 before:absolute before:left-1/2 before:block before:h-full before:w-1 before:-translate-x-1/2 before:rounded-sm before:bg-secondary-600 after:absolute after:top-1/2 after:block after:h-1 after:w-full after:-translate-y-1/2 after:rounded-sm after:bg-secondary-600"></div>
          </Link>
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
          {projects?.map(([p, [all, pending]], i) => {
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
      <section className="w-full -translate-y-12">
        <Link
          href="/pwa/tasks"
          className="sticky flex h-36 w-full justify-between rounded-t-3xl bg-white px-4 pt-2"
          style={{ top: "13.25rem" }}
        >
          <h2 className="text-xl font-medium">Tasks</h2>
          <span className="whitespace-nowrap">see all</span>
        </Link>
        <div className="w-full -translate-y-20">
          {!tasks?.length && (
            <Link
              href="/pwa/tasks/add"
              className="mx-6 block rounded-xl border-4 border-dashed border-zinc-200 py-10 text-center text-zinc-400"
            >
              nothing's here! press to add
            </Link>
          )}
          <div className="h-10"></div>
          <AnimatePresence>
            {tasks?.map((t) => (
              <motion.div
                key={t.id}
                className="animatio sticky px-4 [animation-duration:1ms] [animation-name:fadeOut] [animation-timeline:view(block_26rem)] [animation-timing-function:ease-out]"
                style={{
                  top: `21rem`,
                }}
              >
                <TaskTicket {...t} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="h-60"></div>
        </div>
      </section>
    </>
  );
}
