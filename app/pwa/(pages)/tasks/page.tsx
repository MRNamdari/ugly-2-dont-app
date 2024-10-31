"use client";
import IconButton from "@/app/_components/icon-button";
import TaskTicket from "@/app/_components/task.ticket";
import { ITask } from "@/app/_store/data";
import { store } from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

const Tasks = store.tasks;

export default function TaskBrowserPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  useSignalEffect(() => {
    setTasks(Tasks.value);
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
          Tasks
        </h1>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="Sliders"
          ></IconButton>
        </div>
      </header>
      <section className="p-4 h-full overflow-auto">
        <AnimatePresence>
          {tasks.map((t) => (
            <TaskTicket key={t.id} {...t} />
          ))}
        </AnimatePresence>
      </section>
    </>
  );
}
