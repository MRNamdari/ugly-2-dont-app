"use client";
import Link from "next/link";
import IconButton from "../_components/icon-button";
import TaskTicket from "../_components/task.ticket";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CategorySummary,
  db,
  ICategory,
  IProject,
  PendingTasksCount,
} from "../_store/db";
import { store } from "../_store/state";
import { ITask } from "../_store/db";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { useEffect, useState } from "react";

export default function PWAHomePage() {
  const [searchString, setSearchString] = useState<string>();
  const [expanded, setExpansion] = useState<boolean>(false);

  const listOfTasks = useLiveQuery(
    async () => await db.tasks.toArray(),
    [],
    [] as ITask[],
  );
  const tasks = useLiveQuery(
    async () =>
      (
        await db.tasks.where("due").aboveOrEqual(new Date()).sortBy("due")
      ).filter((t) => t.status !== true),
    [],
    null,
  );

  store.view.task.value = tasks?.map((t) => t.id) ?? [];
  const projects = useLiveQuery(async () => {
    const p = await db.projects.toArray();
    return await Promise.all(
      p.map(async (p) => [p, await PendingTasksCount(p.id)] as const),
    );
  });
  const listOfProjects = projects ? projects.map((a) => a[0]) : [];
  const categories = useLiveQuery(async () => {
    const c = await db.categories.toArray();
    return await Promise.all(
      c.map(async (c) => [c, await CategorySummary(c.id)] as const),
    );
  });

  useEffect(() => {
    document.dispatchEvent(new Event("pageload"));
  }, []);

  const listOfCategories = categories ? categories.map((a) => a[0]) : [];
  const fuseOptions: IFuseOptions<ITask | IProject | ICategory> = {
    ignoreLocation: true,
    includeMatches: true,
    shouldSort: true,
    minMatchCharLength: 3,
    threshold: 0.5,
    keys: ["title", "description"],
  };
  const fuse = [
    new Fuse(listOfTasks, fuseOptions),
    new Fuse(listOfProjects, fuseOptions),
    new Fuse(listOfCategories, fuseOptions),
  ];
  const listOfFeatures = ["T", "P", "C"] as const;
  function highlightMatches(r: FuseResult<ITask | IProject | ICategory>) {
    if (r.matches) {
      const match = r.matches.find((m) => m.key === "title");
      if (match) {
        const highlightedText: (JSX.Element | string)[] = [];
        let lastIndex = 0;

        match.indices.forEach(([start, end]) => {
          highlightedText.push(r.item.title.slice(lastIndex, start));
          highlightedText.push(
            <span className="font-semibold" key={start}>
              {r.item.title.slice(start, end + 1)}
            </span>,
          );
          lastIndex = end + 1;
        });

        highlightedText.push(r.item.title.slice(lastIndex));
        return highlightedText;
      } else return r.item.title;
    } else return r.item.title;
  }
  return (
    <>
      <search
        className="sticky top-0 w-full bg-secondary-100 p-4"
        onClick={(e) => {
          if (
            e.target instanceof HTMLAnchorElement ||
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLButtonElement
          )
            return;
          setExpansion(false);
        }}
      >
        <span
          className={
            'group flex rounded-[1.25rem] bg-white pl-2 has-[+ul[aria-expanded="true"]]:rounded-b-none'
          }
        >
          <input
            type="text"
            name="title"
            required
            placeholder="Type here..."
            onChange={(e) => setSearchString(e.target.value.trim())}
            onFocus={() => setExpansion(true)}
            className="peer w-full bg-transparent placeholder:text-inherit placeholder:transition-colors focus:outline-none group-focus-within:placeholder:text-zinc-400"
          />
          <IconButton
            icon="Search"
            className="tap-zinc-50 ico-md group-focus-within:text-zinc-400 [&_svg]:size-4"
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </span>
        <ul
          className="h-0 w-full overflow-auto rounded-b-[1.25rem] bg-white aria-expanded:h-[calc(100svh-2rem-2.5rem)]"
          aria-expanded={expanded}
        >
          {fuse.map((fs, f) =>
            fs.search(searchString ?? "").map((r, i) => {
              return (
                <li key={i}>
                  <Link
                    href={
                      f == 0
                        ? "/pwa/tasks?id=t" + r.item.id
                        : f == 1
                          ? "/pwa/projects/details/" + r.item.id
                          : "/pwa/categories/details/" + r.item.id
                    }
                    className="block px-4 py-2"
                  >
                    {highlightMatches(r)}
                    <div
                      className={
                        "float-end rounded-sm px-1 text-xs " +
                        (f === 1
                          ? "bg-error-50 text-error-500"
                          : f == 2
                            ? "bg-warning-50 text-warning-500"
                            : "bg-secondary-50 text-secondary-500")
                      }
                    >
                      {listOfFeatures[f]}
                    </div>
                  </Link>
                </li>
              );
            }),
          )}
          <li
            key="eol"
            className="border-t-2 border-zinc-200 px-4 py-2 text-center text-zinc-400"
          >
            {"That's it ;)"}
          </li>
        </ul>
      </search>
      <section
        className="sticky w-full bg-secondary-100"
        style={{ top: "4.5rem" }}
      >
        <Link
          id="browser-categories"
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
            id="add-category"
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
          id="browse-projects"
          href="/pwa/projects"
          className="flex w-full items-center justify-between rounded-t-3xl bg-primary-800 px-4 pt-2"
        >
          <h2 className="text-xl font-medium">Projects</h2>
          <span className="whitespace-nowrap">see all</span>
        </Link>
        <div className="flex w-full overflow-x-auto bg-primary-800 pb-12 pt-4">
          {projects?.map(([p, [all, pending]]) => {
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
            id="add-project"
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
          id="browse-tasks"
          href="/pwa/tasks"
          className="sticky flex h-40 w-full justify-between rounded-t-3xl bg-white px-4 pt-2"
          style={{ top: "13.25rem" }}
        >
          <h2 className="text-xl font-medium">Tasks</h2>
          <span className="whitespace-nowrap">see all</span>
        </Link>
        <div className="w-full -translate-y-20">
          <div className="h-10"></div>
          <p
            aria-hidden={tasks !== null}
            className="sticky w-full py-6 text-center text-zinc-400 [animation-duration:1ms] [animation-name:fadeOut] [animation-timeline:view(block_26rem)] [animation-timing-function:ease-out] aria-hidden:hidden"
          >
            Wait a sec...
          </p>
          <Link
            id="add-task"
            href="/pwa/tasks/add"
            key="add"
            aria-disabled={
              !Array.isArray(tasks) ||
              (Array.isArray(tasks) && tasks.length !== 0)
            }
            className="sticky mx-4 flex h-24 items-center justify-center rounded-xl border-4 border-zinc-200 p-2 [animation-duration:1ms] [animation-name:fadeOut] [animation-timeline:view(block_26rem)] [animation-timing-function:ease-out] aria-disabled:hidden"
          >
            <div className="relative size-6 before:absolute before:left-1/2 before:block before:h-full before:w-1 before:-translate-x-1/2 before:rounded-sm before:bg-zinc-200 after:absolute after:top-1/2 after:block after:h-1 after:w-full after:-translate-y-1/2 after:rounded-sm after:bg-zinc-200"></div>
          </Link>
          <AnimatePresence>
            {tasks?.map((t) => (
              <motion.div
                key={t.id}
                className="sticky px-4 [animation-duration:1ms] [animation-name:fadeOut] [animation-timeline:view(block_26rem)] [animation-timing-function:ease-out]"
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
