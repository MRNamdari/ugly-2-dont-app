"use client";
import IconButton from "@/app/_components/icon-button";
import { FormDataToTask, store } from "@/app/_store/state";
import Link from "next/link";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import Button from "@/app/_components/button";
import { ITaskFormData, Priority } from "@/app/_store/data";
import { useRouter } from "next/navigation";
import { date2display, dateToLocalTime } from "@/app/_components/util";
import { MouseEvent } from "react";

export default function VerifyTaskPage({
  searchParams: state,
}: {
  searchParams: ITaskFormData;
}) {
  const router = useRouter();

  const project = store.projects.value.find((p) => p.id == state.project);

  const category = store.categories.value.find((c) => c.id == state.category);

  const subtasks = Object.entries(state).filter(([key, value]) =>
    /^st[0-9]+$/.test(key)
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
    router.back();
    router.back();
  }

  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] px-4  justify-center items-center bg-secondary-100">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
            onClick={() => {
              router.back();
            }}
          ></IconButton>
        </div>
        <span></span>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="Check"
            onClick={handleSubmit}
          ></IconButton>
        </div>
      </header>
      <div className="bg-secondary-100 px-4 flex flex-col gap-4">
        <article className="bg-white w-full grid gap-2 p-6 rounded-3xl">
          <h2 className="text-lg font-medium">{state.title}</h2>
          {(project || category) && (
            <h3 className="text-primary-600 text-base">
              <Link
                className="underline"
                href={"../projects/details/" + state.project}
              >
                {project?.title}
              </Link>
              {category && (
                <>
                  {" • "}
                  <Link
                    className="underline"
                    href={"../categories/details/" + state.category}
                  >
                    {category.title}
                  </Link>
                </>
              )}
            </h3>
          )}
          <p className="text-primary-700 text-sm">{state.description}</p>
        </article>
        {subtasks.length > 0 && (
          <section className=" w-full rounded-3xl bg-secondary-50">
            {subtasks.map(([key, value]) => (
              <span key={key} className="group">
                <TextInput
                  key={key}
                  className=" text-input-md text-zinc-600 bg-secondary-50 group *:transition-colors border-transparent border-2 border-b-2 border-b-secondary-100 group-last:border-b-transparent"
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
            className={"btn-md tap-error-50 bg-error-50 text-error-600"}
          >
            {state.date && date2display(state.date)}
          </Button>
          <Button
            leadingIcon="Clock"
            className={"btn-md tap-error-50 bg-error-50 text-error-600"}
          >
            {dateToLocalTime(new Date("0 " + state.time))}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-[inherit]">
          <Button
            leadingIcon="Bell"
            className="btn-md bg-zinc-100 text-zinc-600 tap-zinc-200"
          >
            Reminder
          </Button>
          <Button
            leadingIcon="TrendingUp"
            className={
              "btn-md " +
              (state.priority == "0"
                ? "bg-error-50 text-error-600 tap-error-100"
                : state.priority == "1"
                  ? "bg-warning-50 text-warning-600 tap-warning-100"
                  : " bg-secondary-50 text-secondary-600 tap-secondary-100")
            }
          >
            {state.priority && Priority[state.priority]}
          </Button>
        </div>
      </div>
    </>
  );
}
