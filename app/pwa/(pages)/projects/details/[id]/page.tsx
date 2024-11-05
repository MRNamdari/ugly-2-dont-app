"use client";
import IconButton from "@/app/_components/icon-button";
import ProjectTicket from "@/app/_components/project.ticket";
import { IProject, ProjectId } from "@/app/_store/data";
import { modals, store } from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { useRef, useState } from "react";
import ProjectsCarousel, {
  ProjectCarouselRef,
} from "@/app/_components/project.carousel";
import { AnimatePresence, motion } from "framer-motion";
import TaskTicket from "@/app/_components/task.ticket";
import Icon from "@/app/_components/icon";

const projectsSignal = store.projects;
const tasksSignal = store.tasks;
export default function ProjectDetailPage({
  params,
}: {
  params: { id?: ProjectId };
}) {
  const [active, setActive] = useState<ProjectId>(
    params.id ? params.id : projectsSignal.value[0].id
  );
  const [projects, setProjects] = useState<IProject[]>([]);
  const carousel = useRef<ProjectCarouselRef>(null);
  useSignalEffect(() => {
    setProjects(projectsSignal.value);
  });
  const children = [
    ...projects
      .filter((p) => p.projectId === active)
      .map((p) => (
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
    ...tasksSignal.value
      .filter((t) => t.projectId == active)
      .map((t) => <TaskTicket key={t.id} {...t} />),
  ];
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] p-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          />
        </div>
        <motion.h1
          initial={{ transform: "translate(0,-200%)", opacity: 0 }}
          animate={{ transform: "translate(0,0)", opacity: 1 }}
          exit={{ transform: "translate(0,-200%)", opacity: 0 }}
          className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis"
        >
          Projects
        </motion.h1>
        <div></div>
      </header>
      <motion.section
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-4 h-full overflow-auto"
      >
        <ProjectsCarousel
          ref={carousel}
          default={active}
          value={active}
          onChange={(id) => {
            setActive(id);
            window.history.replaceState(
              window.history.state,
              "",
              "/pwa/projects/details/" + id
            );
          }}
        />
        <div className="px-4">
          <AnimatePresence>
            {children.length > 0 ? (
              children
            ) : (
              <div className="flex w-full bg-zinc-100 rounded-3xl items-center justify-center text-zinc-500 font-medium">
                Press <Icon label="PlusCircle" className="ico-md" /> to add
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
      <div className="fixed bottom-4 right-4">
        <IconButton
          initial={{ opacity: 0, scale: 0.9 }}
          exit={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          icon="Plus"
          className="ico-xl bg-primary-800 text-white tap-primary-700 w-fit"
          onClick={() => {
            modals.add.buttons.value = {
              project: "/pwa/projects/add?project=" + active,
              task: "/pwa/tasks/add?project=" + active,
            };
            const addModal = document.querySelector(
              "#add"
            ) as HTMLDialogElement | null;
            if (addModal) addModal.showModal();
          }}
        />
      </div>
    </>
  );
}
