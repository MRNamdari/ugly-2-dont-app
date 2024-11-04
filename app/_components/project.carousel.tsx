import { useState, useRef, useEffect } from "react";
import { IProject, ProjectId } from "../_store/data";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import ProjectCard from "./project.card";
import { store } from "../_store/state";
import { useSignalEffect } from "@preact/signals-react";

const projectsSignal = store.projects;
export default function ProjectsCarousel(props: {
  defaultProject: ProjectId;
  onProjectChange: (id: ProjectId) => void;
}) {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [active, setActiveProject] = useState<ProjectId>(props.defaultProject);
  const offset = projects.findIndex((p) => p.id === active);

  useSignalEffect(() => {
    setProjects(projectsSignal.value);
  });
  useEffect(() => {
    props.onProjectChange(active);
  }, [active]);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  return (
    <>
      <div
        ref={ref}
        className="w-screen whitespace-nowrap overflow-hidden h-[11.5rem] "
      >
        <AnimatePresence>
          {projects.map((p, i) => {
            if (i == 0) {
              return (
                <ProjectCard
                  key={p.id}
                  {...p}
                  x={x}
                  animate={{
                    marginLeft: `calc(-${offset * 100}% + ${offset + 1}rem)`,
                  }}
                  onDelete={() => {
                    if (i + 1 in projects) setActiveProject(projects[i + 1].id);
                  }}
                  onDrag={(e, dir) => {
                    if (dir == 1 && i + 1 in projects) {
                      setActiveProject(projects[i + 1].id);
                    }
                  }}
                />
              );
            }
            return (
              <ProjectCard
                key={p.id}
                {...p}
                x={x}
                onDelete={() => {
                  setActiveProject(projects[i - 1].id);
                }}
                onDrag={(e, dir) => {
                  if (dir == 1) {
                    if (i + 1 in projects) setActiveProject(projects[i + 1].id);
                  } else {
                    setActiveProject(projects[i - 1].id);
                  }
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
      <SlideIndicators count={projects.length} active={offset} />
    </>
  );
}

type SlideIndicatorsProps = {
  count: number;
  active: number;
};

export function SlideIndicators(props: SlideIndicatorsProps) {
  const template = new Array(props.count).fill(0);
  const isInRange = (index: number) =>
    index >= 0 && index < props.count ? true : false;
  template[props.active] = "24px";
  for (let i = -2; i < 3; ++i) {
    if (i == 0) continue;
    if (Math.abs(i) === 2) {
      if (isInRange(props.active + i)) template[props.active + i] = "4px";
      continue;
    }
    if (isInRange(props.active + i)) template[props.active + i] = "6px";
  }
  return (
    <div
      className="mx-auto my-4 grid h-[6px] gap-1 items-center w-fit overflow-hidden transition-[grid-template-columns] ease-in-out"
      style={{ gridTemplateColumns: template.join(" ") }}
    >
      {template.map((col, i) => (
        <div
          key={i}
          className={
            "rounded-full w-full transition-all " +
            (col !== "6px" && col !== "24px"
              ? "bg-zinc-300 h-[4px]"
              : "bg-zinc-400 h-[6px]")
          }
        ></div>
      ))}
    </div>
  );
}
