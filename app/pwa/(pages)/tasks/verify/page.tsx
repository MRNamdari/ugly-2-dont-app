"use client";
import IconButton from "@/app/_components/icon-button";
import { store } from "@/app/_store/state";
import { computed, useComputed } from "@preact/signals-react";
import Link from "next/link";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import Button from "@/app/_components/button";
import { Priority } from "@/app/_store/data";
import { useRouter } from "next/navigation";

export default function VerifyTaskPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();
  const project = useComputed(() =>
    store.projects.value.find((p) => p.id == searchParams.project)
  );
  const category = useComputed(() =>
    store.categories.value.find((c) => c.id == searchParams.category)
  );
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
          ></IconButton>
        </div>
      </header>
      <div className="bg-secondary-100 px-4 flex flex-col gap-4">
        <article className="bg-white w-full grid gap-2 p-6 rounded-3xl">
          <h2 className="text-lg font-medium">{searchParams.title}</h2>
          <h3 className="text-primary-600 text-base">
            <Link
              className="underline"
              href={"../projects/details/" + searchParams.project}
            >
              {project.value?.title}
            </Link>
            {" • "}
            <Link
              className="underline"
              href={"../categories/details/" + searchParams.category}
            >
              {category.value?.title}
            </Link>
          </h3>
          <p className="text-primary-700 text-sm">{searchParams.description}</p>
        </article>
        <section className=" w-full rounded-3xl bg-secondary-50">
          {Object.entries(searchParams)
            .filter(([key, value]) => /st[0-9]+/.test(key))
            .map(([key, value]) => (
              <span key={key} className="group">
                <TextInput
                  key={key}
                  className=" text-input-md text-zinc-600 bg-secondary-50 group *:transition-colors border-transparent border-2 border-b-2 border-b-secondary-100 group-last:border-b-transparent"
                >
                  <Icon label="Hash" className="ico-md text-secondary-600" />
                  <p className="w-full">{value}</p>
                  <Icon
                    label={
                      searchParams[key.replace("t", "s")] === "0"
                        ? "Circle"
                        : "CheckCircle"
                    }
                    className="ico-md text-secondary-600"
                  />
                </TextInput>
              </span>
            ))}
        </section>
        <div className="grid grid-cols-2 gap-[inherit]">
          <Button
            leadingIcon="Calendar"
            className={"btn-md tap-error-50 bg-error-50 text-error-600"}
          >
            {searchParams.date}
          </Button>
          <Button
            leadingIcon="Clock"
            className={"btn-md tap-error-50 bg-error-50 text-error-600"}
          >
            {searchParams.time}
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
            className="btn-md bg-zinc-100 text-zinc-600 tap-zinc-200"
          >
            {Priority[searchParams.priority]}
          </Button>
        </div>
      </div>
    </>
  );
}
