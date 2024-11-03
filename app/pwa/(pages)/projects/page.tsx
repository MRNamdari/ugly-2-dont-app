"use client";
import IconButton from "@/app/_components/icon-button";
import ProjectTicket from "@/app/_components/project.ticket";
import ProjectCard from "@/app/_components/project.card";
import { IProject } from "@/app/_store/data";
import { store } from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

const projectsSignal = store.projects;
export default function ProjectBrowserPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  useSignalEffect(() => {
    setProjects(projectsSignal.value);
  });
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] p-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          ></IconButton>
        </div>
        <h1 className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          Projects
        </h1>
        <div></div>
      </header>
      <section className="p-4 h-full overflow-auto">
        <AnimatePresence>
          {projects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </AnimatePresence>
      </section>
    </>
  );
}
