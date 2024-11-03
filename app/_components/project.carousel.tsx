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
  const { count, active } = props;
  const n = count > 4 ? 4 : count; // number of thumbs
  let template = Array(count);
  var index: number; // position of active thumb
  if (active == count) {
    // when active was the last item
    index = n - 1;
  } else if (active >= n - 1) {
    // when active was not the last
    // item nor the first `n-2` items
    index = n - 2;
  } else {
    index = active;
  }
  for (let i = 0; i < count; i++) template[i] = i;
  template = template.slice(active - index, active - index + n);

  const gridTemplate = Array.from(template, (i) =>
    i == active ? "20px" : "4px"
  );

  const thumbs = Array.from(template, (i, k) => {
    let classNames = "h-full w-full rounded-full bg-zinc-400";
    if (k == n - 1 && i !== count - 1) classNames += " bg-zinc-300";
    if (k == 0 && i !== 0) classNames += " bg-zinc-300";
    return <motion.div key={i} layout className={classNames}></motion.div>;
  });

  return (
    <div
      style={{
        gridTemplateColumns: gridTemplate.join(" "),
      }}
      className="mx-auto my-2 w-fit grid gap-1 items-center h-1"
    >
      {thumbs}
    </div>
  );
}
