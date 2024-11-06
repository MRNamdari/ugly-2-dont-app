import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { IProject, ProjectId } from "../_store/data";
import { AnimatePresence, useMotionValue } from "framer-motion";
import ProjectCard from "./project.card";
import { store } from "../_store/state";
import { useSignalEffect } from "@preact/signals-react";

const projectsSignal = store.projects;
type ProjectsCarouselProps = {
  default: ProjectId;
  value?: ProjectId;
  onChange: (id: ProjectId) => void;
};
export type ProjectCarouselRef = { setActive: (id: ProjectId) => void };
export default forwardRef<ProjectCarouselRef, ProjectsCarouselProps>(
  function ProjectsCarousel(props: ProjectsCarouselProps, ref) {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [active, setActiveProject] = useState<ProjectId>(props.default);
    const offset = projects.findIndex((p) => p.id === active);

    useSignalEffect(() => {
      setProjects(projectsSignal.value);
      console.log(projectsSignal.value);
    });

    useEffect(() => {
      props.onChange(active);
    }, [active]);

    const x = useMotionValue(0);
    useImperativeHandle(ref, () => {
      return {
        setActive(id: ProjectId) {
          setActiveProject(id);
        },
      };
    });
    return (
      <>
        <div className="h-[11.5rem] max-w-screen-sm overflow-hidden whitespace-nowrap">
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
                      if (i + 1 in projects)
                        setActiveProject(projects[i + 1].id);
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
                      if (i + 1 in projects)
                        setActiveProject(projects[i + 1].id);
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
  },
);

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
      className="mx-auto my-4 grid h-[6px] w-fit items-center gap-1 overflow-hidden transition-[grid-template-columns] ease-in-out"
      style={{ gridTemplateColumns: template.join(" ") }}
    >
      {template.map((col, i) => (
        <div
          key={i}
          className={
            "w-full rounded-full transition-all " +
            (col !== "6px" && col !== "24px"
              ? "h-[4px] bg-zinc-300"
              : "h-[6px] bg-zinc-400")
          }
        ></div>
      ))}
    </div>
  );
}
