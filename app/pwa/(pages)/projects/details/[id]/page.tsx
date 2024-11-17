"use client";
import IconButton from "@/app/_components/icon-button";
import ProjectTicket from "@/app/_components/project.ticket";
import { db, IProject } from "@/app/_store/db";
import {
  ProjectFormDataSignal,
  store,
  TaskFormDataSignal,
} from "@/app/_store/state";
import { useContext, useEffect, useRef, useState } from "react";
import ProjectsCarousel, {
  ProjectCarouselRef,
} from "@/app/_components/project.carousel";
import { AnimatePresence, motion } from "framer-motion";
import TaskTicket from "@/app/_components/task.ticket";
import Icon from "@/app/_components/icon";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { AddContext } from "@/app/_components/add.modal";
import { SelectionContext } from "@/app/_components/selection.modal";

export default function ProjectDetailPage({
  params,
}: {
  params: { id?: `${IProject["id"]}` };
}) {
  const router = useRouter();
  const addModal = useContext(AddContext);

  const firstProject = useLiveQuery(async () => {
    return await db.projects.limit(1).first();
  });

  const [active, setActive] = useState<IProject["id"] | undefined>(
    params.id ? parseInt(params.id) : undefined,
  );
  useEffect(() => {
    setActive(firstProject ? firstProject.id : undefined);
    if (firstProject)
      window.history.replaceState(
        window.history.state,
        "",
        "/pwa/projects/details/" + firstProject.id,
      );
  }, [firstProject]);
  useContext(SelectionContext).destination = { feature: "project", id: active };

  const carousel = useRef<ProjectCarouselRef>(null);

  const childFeatures = useLiveQuery(async () => {
    return await Promise.all([
      db.projects
        .where("project")
        .equals(active ?? 0)
        .toArray(),
      db.tasks
        .where("project")
        .equals(active ?? 0)
        .toArray(),
    ]);
  }, [active]);

  const children: JSX.Element[] =
    childFeatures !== undefined
      ? ([] as JSX.Element[]).concat(
          childFeatures[0].map((p) => (
            <ProjectTicket
              key={p.id}
              {...p}
              onOpen={(e, id) => {
                e.preventDefault();
                carousel.current?.setActive(id);
                setActive(id);
              }}
            />
          )),
          childFeatures[1].map((t) => <TaskTicket key={t.id} {...t} />),
        )
      : [];

  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4">
        <div>
          <IconButton
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowLeft"
            onClick={() => router.back()}
          />
        </div>
        <motion.h1
          initial={{ transform: "translate(0,-200%)", opacity: 0 }}
          animate={{ transform: "translate(0,0)", opacity: 1 }}
          exit={{ transform: "translate(0,-200%)", opacity: 0 }}
          className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
        >
          Projects
        </motion.h1>
        <div></div>
      </header>
      <motion.section
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full overflow-auto pt-4"
      >
        <ProjectsCarousel
          ref={carousel}
          default={active ?? 0}
          value={active}
          onChange={(id) => {
            setActive(id);
            window.history.replaceState(
              window.history.state,
              "",
              "/pwa/projects/details/" + id,
            );
          }}
        />
        <div className="px-4">
          <AnimatePresence mode="wait">
            {children.length > 0 ? (
              children
            ) : (
              <motion.div
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full items-center justify-center rounded-3xl bg-zinc-100 font-medium text-zinc-500"
              >
                Press <Icon label="PlusCircle" className="ico-md" /> to add
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-20 w-full"></div>
        </div>
      </motion.section>
      <div className="fixed bottom-4 right-4">
        <IconButton
          initial={{ opacity: 0, scale: 0.9 }}
          exit={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          icon="Plus"
          className="tap-primary-700 ico-xl w-fit bg-primary-800 text-white"
          onClick={() => {
            addModal.showModal({
              project() {
                ProjectFormDataSignal.value = { project: active };
                router.push("/pwa/projects/add/");
              },
              task() {
                TaskFormDataSignal.value = { project: active };
                router.push("/pwa/tasks/add/");
              },
            });
          }}
        />
      </div>
    </>
  );
}
