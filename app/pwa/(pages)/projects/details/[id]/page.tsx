"use client";
import IconButton from "@/app/_components/icon-button";
import ProjectTicket from "@/app/_components/project.ticket";
import { IProject, ProjectId } from "@/app/_store/data";
import { store } from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { useState } from "react";
import ProjectsCarousel from "@/app/_components/project.carousel";
import { useRouter } from "next/navigation";

const projectsSignal = store.projects;
export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // const [projects, setProjects] = useState<IProject[]>([]);
  // useSignalEffect(() => {
  //   setProjects(projectsSignal.value);
  // });
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
      <section className="pt-4 h-full overflow-auto">
        <ProjectsCarousel
          defaultProject={params.id as ProjectId}
          onProjectChange={(id) => {
            console.log(id);
            window.history.replaceState(
              window.history.state,
              "",
              "/pwa/projects/details/" + id
            );
          }}
        />
      </section>
    </>
  );
}
