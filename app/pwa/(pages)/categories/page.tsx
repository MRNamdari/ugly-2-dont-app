"use client";
import { AddContext } from "@/app/_components/add.modal";
import { AddEditCategoryContext } from "@/app/_components/addEditCategory.modal";
import Button from "@/app/_components/button";
import CategoryTicket from "@/app/_components/category.ticket";
import IconButton from "@/app/_components/icon-button";
import ProgressPie from "@/app/_components/progress-pie";
import ProjectTicket from "@/app/_components/project.ticket";
import TaskTicket from "@/app/_components/task.ticket";
import {
  db,
  ICategory,
  IProject,
  ITask,
  TaskProgressByCategory,
  ProjectProgressByCategory,
} from "@/app/_store/db";
import { store } from "@/app/_store/state";
import { batch, useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function CategoryBrowserPage({
  params,
}: {
  params: { id?: `${ICategory["id"]}` };
}) {
  const router = useRouter();

  const addModal = useContext(AddContext);
  const addCat = useContext(AddEditCategoryContext);

  const categories =
    useLiveQuery(async () => {
      return await db.categories
        .where({
          category: params.id ? parseInt(params.id) : 0,
        })
        .toArray();
    }) ?? [];
  const current = useLiveQuery(async () => {
    if (params.id) return await db.categories.get(parseInt(params.id));
  });
  const projects =
    useLiveQuery(async () => {
      return await db.projects
        .where({
          category: params.id ? parseInt(params.id) : 0,
        })
        .toArray();
    }) ?? [];
  const tasks =
    useLiveQuery(async () => {
      return await db.tasks
        .where({
          category: params.id ? parseInt(params.id) : 0,
        })
        .toArray();
    }) ?? [];

  useEffect(() => {
    batch(() => {
      store.view.category.value = categories.map((c) => c.id);
      store.view.project.value = projects.map((c) => c.id);
      store.view.task.value = tasks.map((c) => c.id);
    });
  }, [categories, projects, tasks]);
  useSignalEffect(() => {
    store.selection;
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
          {current ? current.title : "Categories"}
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
          <AnimatePresence>
            {categories.map((c) => (
              <CategoryTicket key={"c" + c.id} {...c} />
            ))}
            {projects.map((p) => (
              <ProjectTicket key={"p" + p.id} {...p} />
            ))}
            {tasks.map((t) => (
              <TaskTicket key={"t" + t.id} {...t} />
            ))}
          </AnimatePresence>
          <div className="h-20 w-full"></div>
        </div>
      </section>
      <div className="fixed bottom-4 right-4">
        <IconButton
          initial={{ opacity: 0, scale: 0.9 }}
          exit={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          icon="Plus"
          className="tap-primary-700 ico-xl w-fit bg-primary-800 text-white"
          onClick={() => {
            addModal.showModal({
              category: function () {
                addCat.onClose = async (value) => {
                  if (value.length > 0) {
                    await db.categories.add({
                      id: (await db.categories.count()) + 1,
                      title: value,
                      category: params.id ? parseInt(params.id) : 0,
                    });
                  }
                };
                addCat.showModal();
              },
            });
          }}
        />
      </div>
    </>
  );
}

function TasksProgress({ id }: { id?: `${ICategory["id"]}` }) {
  const [all, completed] = useLiveQuery(
    async () => TaskProgressByCategory(id ? parseInt(id) : undefined),
    [id],
    [NaN, NaN] as const,
  );
  useEffect(() => {}, [id]);

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

function ProjectsProgress({ id }: { id?: `${ICategory["id"]}` }) {
  const [all, completed] = useLiveQuery(
    async () => ProjectProgressByCategory(id ? parseInt(id) : undefined),
    [id],
    [NaN, NaN] as const,
  );
  useEffect(() => {}, [id]);

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

function Breadcrum({ id }: { id?: `${ICategory["id"]}` }) {
  const router = useRouter();
  const parent = useLiveQuery(
    async () => {
      if (id === undefined) return;
      const cat = await db.categories.get(parseInt(id));
      if (!cat || !cat.category) return;
      const parent = await db.categories.get(cat.category);
      return parent;
    },
    [id],
    undefined,
  );
  if (id !== undefined) {
    if (parent !== undefined) {
      return (
        <div className="flex px-4 text-primary-800">
          <Button
            leadingIcon="ArrowLeft"
            className="tap-secondary-50 btn-sm w-fit bg-secondary-100"
            onClick={() =>
              router.replace("/pwa/categories/details/" + parent.id)
            }
          >
            {parent.title}
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex px-4 text-primary-800">
          <Button
            leadingIcon="ArrowLeft"
            className="tap-secondary-50 btn-sm w-fit bg-secondary-100"
            onClick={() => {
              router.replace("/pwa/categories/");
            }}
          >
            Home
          </Button>
        </div>
      );
    }
  }
  return <div></div>;
}
