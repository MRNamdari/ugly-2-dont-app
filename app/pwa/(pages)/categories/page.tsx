"use client";
import Button from "@/app/_components/button";
import CategoryTicket from "@/app/_components/category.ticket";
import IconButton from "@/app/_components/icon-button";
import ProgressPie from "@/app/_components/progress-pie";
import ProjectTicket from "@/app/_components/project.ticket";
import TaskTicket from "@/app/_components/task.ticket";
import { CategoryId, ICategory, IProject, ITask } from "@/app/_store/data";
import {
  ProjectProgressByCategory,
  SelectCategoryByCategoryId,
  SelectProjectByCategoryId,
  SelectTasksByCategoryId,
  store,
  TasksProgressByCategory,
} from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const categoriesSignal = store.categories;

export default function CategoryBrowserPage({
  params,
}: {
  params: { id?: CategoryId };
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  useSignalEffect(() => {
    new Promise<ICategory[]>((resolve) =>
      resolve(SelectCategoryByCategoryId(params.id).value),
    ).then(setCategories);
    new Promise<IProject[]>((resolve) =>
      resolve(SelectProjectByCategoryId(params.id)),
    ).then(setProjects);
    new Promise<ITask[]>((resolve) =>
      resolve(SelectTasksByCategoryId(params.id)),
    ).then(setTasks);
  });
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4">
        <div>
          <IconButton
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowLeft"
            onClick={() => {
              router.back();
            }}
          />
        </div>
        <motion.h1
          initial={{ transform: "translate(0,-200%)", opacity: 0 }}
          animate={{ transform: "translate(0,0)", opacity: 1 }}
          exit={{ transform: "translate(0,-200%)", opacity: 0 }}
          className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
        >
          Categories
        </motion.h1>
        <div></div>
      </header>
      <section className="grid h-full grid-rows-[2rem_2rem_auto] gap-4 overflow-auto">
        <div className="grid h-fit grid-flow-col justify-between gap-4 px-4 text-primary-600">
          <TasksProgress id={params.id} />
          <ProjectsProgress id={params.id} />
        </div>
        <Breadcrum id={params.id} />
        <div className="h-full overflow-auto px-4">
          {categories.map((c) => (
            <CategoryTicket key={c.id} {...c} />
          ))}
          {projects.map((p) => (
            <ProjectTicket key={p.id} {...p} />
          ))}
          {tasks.map((t) => (
            <TaskTicket key={t.id} {...t} />
          ))}
        </div>
      </section>
    </>
  );
}

function TasksProgress({ id }: { id?: CategoryId }) {
  const [[all, completed], setResults] = useState<Readonly<[number, number]>>([
    NaN,
    NaN,
  ]);
  useEffect(() => {}, [id]);
  useSignalEffect(() => {
    new Promise<Readonly<[number, number]>>((resolve) =>
      resolve(TasksProgressByCategory(id).value),
    ).then((value) => setResults(value));
  });

  if (!isNaN(all) && !isNaN(completed) && all > 0)
    return (
      <div className="flex items-center gap-2">
        <ProgressPie progress={(completed / all) * 100} />
        <div className="text-sm leading-3">
          {completed}/{all}
          <p>Tasks</p>
        </div>
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      <ProgressPie progress={0} />
      <div className="text-sm leading-3">
        0/0
        <p>Tasks</p>
      </div>
    </div>
  );
}

function ProjectsProgress({ id }: { id?: CategoryId }) {
  const [[all, completed], setResults] = useState<Readonly<[number, number]>>([
    NaN,
    NaN,
  ]);
  useEffect(() => {}, [id]);
  useSignalEffect(() => {
    new Promise<Readonly<[number, number]>>((resolve) =>
      resolve(ProjectProgressByCategory(id).value),
    ).then(setResults);
  });

  if (!isNaN(all) && !isNaN(completed) && all > 0)
    return (
      <div className="flex items-center gap-2">
        <ProgressPie progress={(completed / all) * 100} />
        <div className="text-sm leading-3">
          {completed}/{all}
          <p>Projects</p>
        </div>
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      <ProgressPie progress={0} />
      <div className="text-sm leading-3">
        0/0
        <p>Projects</p>
      </div>
    </div>
  );
}

function Breadcrum(props: { id?: CategoryId }) {
  const router = useRouter();
  if (props.id !== undefined) {
    const cat = store.categories.value.find((c) => c.id === props.id)!;
    const parent =
      cat?.categoryId &&
      store.categories.value.find((c) => c.id === cat.categoryId);
    if (parent !== undefined) {
      return (
        <div className="flex px-4 text-primary-800">
          <Button
            leadingIcon="ArrowLeft"
            className="tap-secondary-50 btn-sm w-fit rounded-r-none bg-secondary-100"
            onClick={() =>
              router.replace("/pwa/categories/details/" + parent.id)
            }
          >
            {parent.title}
          </Button>
          <Button
            disabled
            className="btn-sm w-fit rounded-l-none border-2 border-secondary-100"
          >
            {cat.title}
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex px-4 text-primary-800">
          <Button
            leadingIcon="ArrowLeft"
            className="tap-secondary-50 btn-sm w-fit rounded-r-none bg-secondary-100"
            onClick={() => {
              router.replace("/pwa/categories/");
            }}
          >
            Home
          </Button>
          <Button
            disabled
            className="btn-sm w-fit rounded-l-none border-2 border-secondary-100"
          >
            {cat.title}
          </Button>
        </div>
      );
    }
  }
  return <div></div>;
}
