"use client";
import IconButton from "@/app/_components/icon-button";
import TaskTicket from "@/app/_components/task.ticket";
import { db } from "@/app/_store/db";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TaskBrowserPage() {
  const router = useRouter();
  const tasks =
    useLiveQuery(async () => {
      return await db.tasks.toArray();
    }) ?? [];
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4">
        <div>
          <IconButton
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowLeft"
            onClick={() => router.back()}
          ></IconButton>
        </div>
        <motion.h1
          initial={{ transform: "translate(0,-200%)", opacity: 0 }}
          animate={{ transform: "translate(0,0)", opacity: 1 }}
          exit={{ transform: "translate(0,-200%)", opacity: 0 }}
          className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
        >
          Tasks
        </motion.h1>
        <div>
          <IconButton
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="Sliders"
          ></IconButton>
        </div>
      </header>
      <section className="h-full overflow-auto p-4">
        <AnimatePresence>
          {tasks.map((t) => (
            <TaskTicket key={t.id} {...t} />
          ))}
        </AnimatePresence>
      </section>
    </>
  );
}
