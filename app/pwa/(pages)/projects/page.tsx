"use client";
import IconButton from "@/app/_components/icon-button";
import ProjectTicket from "@/app/_components/project.ticket";
import { store } from "@/app/_store/state";

const projects = store.projects;
export default function ProjectBrowserPage() {
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
        {projects.value.map((p) => (
          <ProjectTicket key={p.id} {...p} />
        ))}
      </section>
    </>
  );
}
