"use client";
// Types and Constants
import type { IProject, ICategory } from "@/app/_store/db";
import { Priority } from "@/app/_store/data";
// Hooks
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
// Components
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import { motion } from "framer-motion";
import { db } from "@/app/_store/db";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarContext } from "@/app/_components/calendar.modal";
import { ClockContext } from "@/app/_components/clock.modal";

import { date2display, timeToLocalTime } from "@/app/_components/util";
export default function AddProjectPage({
  params,
}: {
  params: { id: `${IProject["id"]}` };
}) {
  const router = useRouter();
  const calendar = useContext(CalendarContext);
  const clock = useContext(ClockContext);

  const res = useLiveQuery(
    async () => {
      const results: {
        projects: IProject[];
        categories: ICategory[];
        initial?: IProject;
        project?: IProject;
        category?: ICategory;
      } = {
        projects: await db.projects.toArray(),
        categories: await db.categories.toArray(),
      };

      const initial = await db.projects.get(parseInt(params.id));
      if (initial) {
        results.initial = initial;
        if (initial.category)
          results.category = await db.categories.get(initial.category);
        if (initial.project)
          results.project = await db.projects.get(initial.project);
      }
      return results;
    },
    [params.id],
    {
      projects: [],
      categories: [],
      initial: undefined,
      project: undefined,
      category: undefined,
    },
  );

  const [state, setState] = useState<Partial<IProject>>(res.initial ?? {});

  useEffect(() => {
    if (res.initial) setState(res.initial);
  }, [res.initial]);

  const form = useRef<HTMLFormElement>(null);

  const fuseCats = new Fuse(res.categories, { keys: ["title"] });
  const fusePrjs = new Fuse(res.projects, { keys: ["title", "description"] });

  const [catSearch, setCatSearch] = useState<string>("");
  const [prjSearch, setPrjSearch] = useState<string>("");

  const [err, setError] = useState({
    title: false,
    date: false,
    time: false,
  });

  function mapCats<T extends { item: ICategory }>({ item }: T) {
    return (
      <MenuItem
        key={item.id}
        value={item.id.toString()}
        onSelect={(category) =>
          setState({ ...state, category: parseInt(category) })
        }
        className="menu-item-zinc-100 tap-zinc-300 hover:menu-item-zinc-200 active:menu-item-zinc-300"
      >
        {item.title}
      </MenuItem>
    );
  }
  function mapPrjs<T extends { item: IProject }>({ item }: T) {
    return (
      <MenuItem
        key={item.id}
        value={item.id.toString()}
        onSelect={(project) =>
          setState({ ...state, project: parseInt(project) })
        }
        className="menu-item-zinc-100 tap-zinc-300 hover:menu-item-zinc-200 active:menu-item-zinc-300"
      >
        {item.title}
      </MenuItem>
    );
  }
  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    const f = form.current;
    if (!f) return;
    if (f.checkValidity()) {
      if (params.id) {
        // On Edit Project Page
        await db.projects.update(parseInt(params.id), state);
      } else {
        // On Add Project Page
        await db.projects.add(state as IProject);
      }
      router.back();
    }
  }
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4">
        <div>
          <IconButton
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowLeft"
            onClick={() => {
              router.back();
            }}
          ></IconButton>
        </div>
        <motion.h1
          initial={{ transform: "translate(0,-200%)", opacity: 0 }}
          animate={{ transform: "translate(0,0)", opacity: 1 }}
          exit={{ transform: "translate(0,-200%)", opacity: 0 }}
          className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
        >
          {params.id ? "Edit" : "New"} Project
        </motion.h1>
        <div>
          <IconButton
            initial={{ opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSubmit}
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="Check"
          />
        </div>
      </header>
      <motion.form
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={form}
        action="/pwa/tasks/verify"
        method="GET"
        className="flex h-full flex-col"
        onSubmit={(e) => e.preventDefault()}
      >
        {params.id && (
          <input type="hidden" name="id" defaultValue={params.id} />
        )}
        <section className="grid h-fit grid-flow-row gap-4 px-4 pt-10">
          {/* Title */}
          <TextInput
            className={
              (err.title
                ? "bg-error-50 text-error-600"
                : "bg-zinc-100 text-zinc-600") +
              " group text-input-md *:transition-colors"
            }
            error={<Error visible={err.title}>* add a title</Error>}
          >
            <input
              type="text"
              name="title"
              defaultValue={state.title}
              required
              onInvalid={(e) => {
                err.title = true;
              }}
              onBlur={(e) => {
                const isValid = e.target.checkValidity();
                setError((err) => ({
                  ...err,
                  title: !isValid,
                }));
                if (isValid) {
                  setState({ ...state, title: e.target.value.trim() });
                }
              }}
              placeholder="Title*"
              className="peer placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
            />
          </TextInput>
          {/* Description */}
          <TextInput className="group text-input-md bg-zinc-100 text-zinc-600 *:transition-colors">
            <Icon
              label="PlusCircle"
              className="ico-md group-focus-within:text-zinc-400"
            />
            <input
              type="text"
              name="description"
              defaultValue={state.description}
              placeholder="Description"
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val.length > 0) setState({ ...state, description: val });
              }}
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
            />
          </TextInput>
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-[inherit]">
            <span>
              <Button
                leadingIcon="Calendar"
                className={
                  "tap-zinc-200 btn-md " +
                  (err.date
                    ? "bg-error-50 text-error-600"
                    : "bg-zinc-100 text-zinc-600")
                }
                onClick={(e) => {
                  e.preventDefault();
                  calendar.onClose = (d) => {
                    console.log(d);
                    setError((e) => ({ ...e, date: d === undefined }));
                    setState((s) => ({ ...s, date: d }));
                  };
                  calendar.showModal(state?.date);
                }}
              >
                {state?.date ? date2display(state.date) : "Date*"}
                <input
                  type="date"
                  required
                  name="date"
                  hidden
                  onInvalid={() => {
                    setError((err) => ({
                      ...err,
                      date: true,
                    }));
                  }}
                  defaultValue={state?.date?.toISOString().slice(0, 10)}
                />
              </Button>
              <Error visible={err.date}>* add a due date</Error>
            </span>
            <span>
              <Button
                leadingIcon="Clock"
                className={
                  "tap-zinc-200 btn-md " +
                  (err.time
                    ? "bg-error-50 text-error-600"
                    : "bg-zinc-100 text-zinc-600")
                }
                onClick={(e) => {
                  e.preventDefault();
                  clock.showModal(state.time);
                  clock.onClose = (time) => {
                    console.log("%o", time);
                    if (time) setState((s) => ({ ...s, time }));
                  };
                }}
              >
                {state.time ? timeToLocalTime(state.time) : "Time*"}
                <input
                  type="time"
                  required
                  name="time"
                  hidden
                  onInvalid={() => {
                    setError((err) => ({
                      ...err,
                      time: true,
                    }));
                  }}
                  defaultValue={state?.time?.toTimeString().slice(0, 8)}
                />
              </Button>
              <Error visible={err.time}>* add a due time</Error>
            </span>
          </div>
          {/* Project */}
          <Menu
            leadingIcon="Crosshair"
            label="Project"
            name="project"
            defaultValue={{
              name: res.project?.title,
              value: state.project?.toString(),
            }}
            className="menu-zinc-100 tap-zinc-200 menu-md menu-filled text-zinc-600"
          >
            <MenuItem searchbar className="border-b-2 border-zinc-200">
              <TextInput className="group text-input-md rounded-none bg-zinc-100 text-zinc-600 *:transition-colors">
                <Icon label="Search" className="ico-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (val.length > 0) setPrjSearch(val);
                    else setPrjSearch("");
                  }}
                />
              </TextInput>
            </MenuItem>
            {prjSearch.length
              ? fusePrjs.search(prjSearch).map(mapPrjs)
              : res.projects.map((v) => mapPrjs({ item: v }))}
          </Menu>
          {/* Categories */}
          <Menu
            leadingIcon="FolderPlus"
            label="Category"
            name="category"
            defaultValue={{
              name: res.categories.find((c) => c.id == state?.category)?.title,
              value: state?.category?.toString(),
            }}
            className="menu-zinc-100 tap-zinc-200 menu-md menu-filled text-zinc-600"
          >
            <MenuItem searchbar className="border-b-2 border-zinc-200">
              <TextInput className="group text-input-md rounded-none text-zinc-600 *:transition-colors">
                <Icon label="Search" className="ico-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (val.length > 0) setCatSearch(val);
                    else setCatSearch("");
                  }}
                />
              </TextInput>
            </MenuItem>
            {catSearch.length
              ? fuseCats.search(catSearch).map(mapCats)
              : res.categories.map((v) => mapCats({ item: v }))}
          </Menu>
          {/* Reminder & Priority */}
          <div className="grid grid-cols-2 gap-[inherit]">
            <Button
              leadingIcon="Bell"
              className="btn-md border-2 border-zinc-100 text-zinc-300"
              disabled
            >
              Reminder
            </Button>
            <Menu
              leadingIcon="TrendingUp"
              label="Priority"
              name="priority"
              defaultValue={
                state?.priority !== undefined
                  ? {
                      name: Priority[state.priority ?? "2"],
                      value: Priority[Priority[state.priority ?? "2"]],
                    }
                  : undefined
              }
              className="menu-zinc-100 tap-zinc-200 menu-md menu-filled text-zinc-600"
            >
              <MenuItem
                value="2"
                onSelect={(priority) => setState({ ...state, priority: 2 })}
                className="menu-item-secondary-50 tap-secondary-100 text-secondary-600"
              >
                Low
              </MenuItem>
              <MenuItem
                value="1"
                onSelect={(priority) => setState({ ...state, priority: 1 })}
                className="menu-item-warning-50 tap-warning-100 text-warning-700"
              >
                Medium
              </MenuItem>
              <MenuItem
                value="0"
                onSelect={(priority) => setState({ ...state, priority: 0 })}
                className="menu-item-error-50 tap-error-100 text-error-600"
              >
                High
              </MenuItem>
            </Menu>
          </div>
        </section>
      </motion.form>
    </>
  );
}

function Error(props: { children: React.ReactNode; visible: boolean }) {
  return (
    <p
      className={
        "overflow-hidden px-2 text-sm text-error-500 transition-[height] " +
        (props.visible ? "h-5" : "h-0")
      }
    >
      {props.children}
    </p>
  );
}
