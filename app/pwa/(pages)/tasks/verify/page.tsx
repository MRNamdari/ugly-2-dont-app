"use client";
import IconButton from "@/app/_components/icon-button";
import { TaskFormDataSignal } from "@/app/_store/state";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import Button from "@/app/_components/button";
import { addDueTo, addIdTo, db, ITask, Priority } from "@/app/_store/db";
import { useRouter } from "next/navigation";
import { date2display, timeToLocalTime } from "@/app/_store/util";
import { MouseEvent, useState } from "react";
import { motion } from "framer-motion";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from "dexie-react-hooks";

export default function VerifyTaskPage() {
  const router = useRouter();
  const [state, setState] = useState(TaskFormDataSignal.value);
  useSignalEffect(() => {
    setState(TaskFormDataSignal.value);
  });

  const [project, category] = useLiveQuery(
    async () => {
      return [
        state.project !== undefined
          ? await db.projects.get(state.project)
          : undefined,
        state.category !== undefined
          ? await db.categories.get(state.category)
          : undefined,
      ];
    },
    [state.project, state.category],
    [undefined, undefined],
  );

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    const newTask = addDueTo(state as ITask);
    console.log(newTask);
    if (state.id) {
      await db.tasks.update(state.id, newTask);
    } else {
      await db.tasks.add(await addIdTo("tasks", newTask));
    }

    TaskFormDataSignal.value = {};
    window.history.go(-2);
  }

  return (
    <>
      <motion.header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center bg-secondary-100 px-4">
        <div>
          <IconButton
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowLeft"
            onClick={() => router.back()}
          ></IconButton>
        </div>
        <span></span>
        <div>
          <IconButton
            initial={{ opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="Check"
            onClick={handleSubmit}
          ></IconButton>
        </div>
      </motion.header>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex select-none flex-col gap-4 bg-secondary-100 px-4"
      >
        <article className="grid w-full gap-2 rounded-3xl bg-white p-6">
          <h2 className="text-lg font-medium">{state.title}</h2>
          {(project || category) && (
            <h3 className="text-base text-primary-600">
              <p className="inline underline">{project?.title}</p>
              {category && project && " • "}
              {category && <p className="inline underline">{category.title}</p>}
            </h3>
          )}
          <p className="text-sm text-primary-700">{state.description}</p>
        </article>
        {state.subtasks && state.subtasks.length > 0 && (
          <section className="w-full rounded-3xl bg-secondary-50">
            {state.subtasks.map((st) => (
              <span key={st.id} className="group">
                <TextInput className="group text-input-md border-2 border-b-2 border-transparent border-b-secondary-100 bg-secondary-50 text-zinc-600 *:transition-colors group-last:border-b-transparent">
                  <Icon label="Hash" className="ico-md text-secondary-600" />
                  <p className="w-full">{st.title}</p>
                  <Icon
                    label={st.status ? "CheckCircle" : "Circle"}
                    className="ico-md text-secondary-600"
                  />
                </TextInput>
              </span>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-[inherit]">
          <Button
            disabled
            leadingIcon="Calendar"
            className={"tap-error-50 btn-md bg-error-50 text-error-600"}
          >
            {state.date && date2display(state.date)}
          </Button>
          <Button
            disabled
            leadingIcon="Clock"
            className={"tap-error-50 btn-md bg-error-50 text-error-600"}
          >
            {state.time && timeToLocalTime(state.time)}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-[inherit]">
          <Button
            disabled
            leadingIcon="Bell"
            trailingIcon={state.reminder && "Check"}
            className={
              "tap-zinc-200 btn-md text-zinc-600 " +
              (state.reminder ? "bg-amber-100" : "bg-zinc-100")
            }
          >
            Reminder
          </Button>
          <Button
            disabled
            leadingIcon="TrendingUp"
            className={
              "btn-md " +
              (state.priority == 0
                ? "tap-error-100 bg-error-50 text-error-600"
                : state.priority == 1
                  ? "tap-warning-100 bg-warning-50 text-warning-600"
                  : " tap-secondary-100 bg-secondary-50 text-secondary-600")
            }
          >
            {state.priority !== undefined &&
              Priority[state.priority as 0 | 1 | 2]}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
