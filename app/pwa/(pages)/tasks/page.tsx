"use client";
import IconButton from "@/app/_components/icon-button";
import TaskTicket from "@/app/_components/task.ticket";
import { TaskFilterContext } from "@/app/_components/taskFilter.modal";
import { db } from "@/app/_store/db";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function TaskBrowserPage() {
  const router = useRouter();
  const filterModal = useContext(TaskFilterContext);
  type Filter = Parameters<(typeof filterModal)["onClose"]>["0"];
  const [filter, setFilter] = useState<Filter>({});

  const tasks =
    useLiveQuery(async () => {
      var query = db.tasks.filter((t) => {
        if (filter?.category && filter.category !== t.category) return false;
        if (filter?.project && filter.project !== t.project) return false;
        if (filter?.priority && filter.priority !== t.priority) return false;
        if (
          filter?.title &&
          filter.title.trim().length &&
          !new RegExp(filter.title.replace(/\s+/, "s*"), "i").test(t.title)
        )
          return false;
        if (filter?.date) {
          if (t.date < filter.date) return false;
          const endOfDay = filter.date;
          endOfDay.setHours(24, 0, 0, 0);
          if (t.date > endOfDay) return false;
        }
        if (filter?.time) {
          if (t.time.getTime() !== filter.time.getTime()) return false;
        }
        return true;
      });

      return await query.toArray();
    }, [filter]) ?? [];
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
            onClick={() => {
              filterModal.onClose = setFilter;
              filterModal.showModal();
            }}
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
