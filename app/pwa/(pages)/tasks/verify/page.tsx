"use client";
import IconButton from "@/app/_components/icon-button";
import {
  FormDataToTask,
  store,
  TaskFormDataSignal,
  TaskToFormData,
} from "@/app/_store/state";
import Link from "next/link";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import Button from "@/app/_components/button";
import { Priority } from "@/app/_store/data";
import { useRouter } from "next/navigation";
import { date2display, dateToLocalTime } from "@/app/_components/util";
import { MouseEvent, useState } from "react";
import { motion } from "framer-motion";
import { useSignalEffect } from "@preact/signals-react";

export default function VerifyTaskPage() {
  const router = useRouter();
  const [state, setState] = useState(TaskFormDataSignal.value);
  useSignalEffect(() => {
    setState(TaskFormDataSignal.value);
  });
  const project = store.projects.value.find((p) => p.id == state.project);

  const category = store.categories.value.find((c) => c.id == state.category);

  const subtasks = Object.entries(state).filter(([key, value]) =>
    /^st[0-9]+$/.test(key),
  );

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    const tasks = store.tasks.value;
    const newTask = FormDataToTask(state);
    if (state.id) {
      const index = tasks.findIndex((t) => t.id == state.id);
      tasks[index] = newTask;
    } else {
      tasks.push(newTask);
    }
    store.tasks.value = tasks;
    TaskFormDataSignal.value = {};
    router.back();
    router.back();
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
        className="flex flex-col gap-4 bg-secondary-100 px-4"
      >
        <article className="grid w-full gap-2 rounded-3xl bg-white p-6">
          <h2 className="text-lg font-medium">{state.title}</h2>
          {(project || category) && (
            <h3 className="text-base text-primary-600">
              <Link
                className="underline"
                href={"../projects/details/" + project?.id}
              >
                {project?.title}
              </Link>
              {category && project && " • "}
              {category && (
                <Link
                  className="underline"
                  href={"../categories/details/" + category.id}
                >
                  {category.title}
                </Link>
              )}
            </h3>
          )}
          <p className="text-sm text-primary-700">{state.description}</p>
        </article>
        {subtasks.length > 0 && (
          <section className="w-full rounded-3xl bg-secondary-50">
            {subtasks.map(([key, value]) => (
              <span key={key} className="group">
                <TextInput
                  key={key}
                  className="group text-input-md border-2 border-b-2 border-transparent border-b-secondary-100 bg-secondary-50 text-zinc-600 *:transition-colors group-last:border-b-transparent"
                >
                  <Icon label="Hash" className="ico-md text-secondary-600" />
                  <p className="w-full">{value}</p>
                  <Icon
                    label={
                      state[key.replace("t", "s") as `st${string}`] === "0"
                        ? "Circle"
                        : "CheckCircle"
                    }
                    className="ico-md text-secondary-600"
                  />
                </TextInput>
              </span>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-[inherit]">
          <Button
            leadingIcon="Calendar"
            className={"tap-error-50 btn-md bg-error-50 text-error-600"}
          >
            {state.date && date2display(state.date)}
          </Button>
          <Button
            leadingIcon="Clock"
            className={"tap-error-50 btn-md bg-error-50 text-error-600"}
          >
            {dateToLocalTime(new Date("0 " + state.time))}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-[inherit]">
          <Button
            leadingIcon="Bell"
            className="tap-zinc-200 btn-md bg-zinc-100 text-zinc-600"
          >
            Reminder
          </Button>
          <Button
            leadingIcon="TrendingUp"
            className={
              "btn-md " +
              (state.priority == "0"
                ? "tap-error-100 bg-error-50 text-error-600"
                : state.priority == "1"
                  ? "tap-warning-100 bg-warning-50 text-warning-600"
                  : " tap-secondary-100 bg-secondary-50 text-secondary-600")
            }
          >
            {state.priority && Priority[state.priority]}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
