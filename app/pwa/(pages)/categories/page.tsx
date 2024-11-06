"use client";
import CategoryTicket from "@/app/_components/category.ticket";
import IconButton from "@/app/_components/icon-button";
import ProgressPie from "@/app/_components/progress-pie";
import { CategoryId } from "@/app/_store/data";
import {
  ProjectProgressByCategory,
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
  const [categories, setCategories] = useState(categoriesSignal.value);

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
      <section className="grid h-full grid-flow-row overflow-auto">
        <div className="grid grid-flow-col justify-between gap-4 px-4 text-primary-600">
          <TasksProgress id={params.id} />
          <ProjectsProgress id={params.id} />
        </div>
        <div>Breadcrum will be here</div>
        <div className="h-full overflow-auto px-4">
          {categories.map((c) => (
            <CategoryTicket key={c.id} {...c} />
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

  if (all && completed)
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
    ).then((value) => setResults(value));
  });

  if (all && completed)
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
