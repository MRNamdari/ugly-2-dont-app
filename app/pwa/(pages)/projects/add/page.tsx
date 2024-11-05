"use client";
// Types and Constants
import type { IProject, ICategory, IProjectFormData } from "@/app/_store/data";
import { Priority } from "@/app/_store/data";
// Signals
import { useSignalEffect } from "@preact/signals-react/runtime";
import { computed } from "@preact/signals-react";
import { FormDataToProject, modals, store } from "@/app/_store/state";
// Hooks
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
// Components
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import { motion } from "framer-motion";
const cats = computed(() => store.categories.value);
const fuseCats = new Fuse(cats.value, { keys: ["title"] });

const prjs = computed(() => store.projects.value);
const fusePrjs = new Fuse(prjs.value, { keys: ["title", "description"] });

export default function AddProjectPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: IProjectFormData;
}) {
  const router = useRouter();
  const [state, setState] = useState<IProjectFormData>(searchParams);
  const form = useRef<HTMLFormElement>(null);

  const [catSearch, setCatSearch] = useState<string>("");
  const [prjSearch, setPrjSearch] = useState<string>("");

  const [err, setError] = useState({
    title: false,
    date: false,
    time: false,
  });

  if (state.date && !modals.calendar.signal.peek())
    modals.calendar.signal.value = new Date(state.date);

  if (state.time && !modals.clock.signal.peek())
    modals.clock.signal.value = new Date("0 " + state.time);

  useSignalEffect(() => {
    const time = modals.clock.value.value;
    if (time.length > 0 && state.time !== time) {
      setError((e) => ({ ...e, time: false }));
      setState((s) => ({ ...s, time }));
    }
    const date = modals.calendar.value.value;
    if (date.length > 0 && date !== state.date) {
      setError((e) => ({ ...e, date: false }));
      setState((s) => ({ ...s, date }));
    }
  });

  function mapCats<T extends { item: ICategory }>({ item }: T) {
    return (
      <MenuItem
        key={item.id}
        value={item.id}
        onSelect={(category) => setState({ ...state, category })}
        className="menu-item-zinc-100 hover:menu-item-zinc-200 active:menu-item-zinc-300 tap-zinc-300"
      >
        {item.title}
      </MenuItem>
    );
  }
  function mapPrjs<T extends { item: IProject }>({ item }: T) {
    return (
      <MenuItem
        key={item.id}
        value={item.id}
        onSelect={(project) => setState({ ...state, project })}
        className="menu-item-zinc-100 hover:menu-item-zinc-200 active:menu-item-zinc-300 tap-zinc-300"
      >
        {item.title}
      </MenuItem>
    );
  }
  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    const f = form.current;
    if (!f) return;
    if (f.checkValidity()) {
      const projects = store.projects.value;
      if (params.id) {
        const index = projects.findIndex((t) => t.id == state.id);
        projects[index] = FormDataToProject({
          id: params.id,
          ...state,
        });
      } else {
        projects.push(FormDataToProject(state));
      }
      store.projects.value = projects;
      router.back();
    }
  }
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] p-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
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
          className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {params.id ? "Edit" : "New"} Project
        </motion.h1>
        <div>
          <IconButton
            initial={{ opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSubmit}
            className="ico-lg tap-zinc-100 text-primary-900"
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
        className="flex flex-col h-full"
        onSubmit={(e) => e.preventDefault()}
      >
        {params.id && (
          <input type="hidden" name="id" defaultValue={params.id} />
        )}
        <section className="grid grid-flow-row gap-4 px-4 h-fit pt-10">
          {/* Title */}
          <TextInput
            className={
              (err.title
                ? "text-error-600 bg-error-50"
                : "text-zinc-600 bg-zinc-100") +
              " text-input-md group *:transition-colors"
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
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400 peer"
            />
          </TextInput>
          {/* Description */}
          <TextInput className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors">
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
                  "btn-md tap-zinc-200 " +
                  (err.date
                    ? "bg-error-50 text-error-600"
                    : "bg-zinc-100 text-zinc-600")
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (state.date)
                    modals.calendar.signal.value = new Date(state.date);
                  const cal = document.querySelector(
                    "#calendar"
                  ) as HTMLDialogElement;
                  cal.showModal();
                }}
                onTap={(e) =>
                  setTimeout(
                    () => (e.target as HTMLElement).removeAttribute("style"),
                    600
                  )
                }
              >
                {modals.calendar.display}
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
                  defaultValue={state.date}
                />
              </Button>
              <Error visible={err.date}>* add a due date</Error>
            </span>
            <span>
              <Button
                leadingIcon="Clock"
                className={
                  "btn-md tap-zinc-200 " +
                  (err.time
                    ? "bg-error-50 text-error-600"
                    : "bg-zinc-100 text-zinc-600")
                }
                onClick={(e) => {
                  e.preventDefault();
                  const clk = document.querySelector(
                    "#clock"
                  ) as HTMLDialogElement;
                  clk.showModal();
                }}
                onTap={(e) =>
                  setTimeout(
                    () => (e.target as HTMLElement).removeAttribute("style"),
                    600
                  )
                }
              >
                {modals.clock.display}
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
                  defaultValue={state.time}
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
              name: prjs.value.find((p) => p.id == state.project)?.title,
              value: state.project,
            }}
            className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
          >
            <MenuItem searchbar className="">
              <TextInput className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors rounded-none">
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
              : prjs.value.map((v) => mapPrjs({ item: v }))}
          </Menu>
          {/* Categories */}
          <Menu
            leadingIcon="FolderPlus"
            label="Category"
            name="category"
            defaultValue={{
              name: cats.value.find((c) => c.id == state.category)?.title,
              value: state.category,
            }}
            className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
          >
            <MenuItem searchbar className="">
              <TextInput className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors rounded-none">
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
              : cats.value.map((v) => mapCats({ item: v }))}
          </Menu>
          {/* Reminder & Priority */}
          <div className="grid grid-cols-2 gap-[inherit]">
            <Button
              leadingIcon="Bell"
              className="btn-md bg-zinc-100 text-zinc-600 tap-zinc-200"
            >
              Reminder
            </Button>
            <Menu
              leadingIcon="TrendingUp"
              label="Priority"
              name="priority"
              defaultValue={
                state.priority !== undefined
                  ? {
                      name: Priority[state.priority ?? "2"],
                      value: Priority[Priority[state.priority ?? "2"]],
                    }
                  : undefined
              }
              className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
            >
              <MenuItem
                value="2"
                onSelect={(priority) => setState({ ...state, priority })}
                className="menu-item-secondary-50 tap-secondary-100"
              >
                Low
              </MenuItem>
              <MenuItem
                value="1"
                onSelect={(priority) => setState({ ...state, priority })}
                className="menu-item-warning-50 tap-warning-100"
              >
                Medium
              </MenuItem>
              <MenuItem
                value="0"
                onSelect={(priority) => setState({ ...state, priority })}
                className="menu-item-error-50 tap-error-100"
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
        "text-sm px-2 text-error-500 transition-[height] overflow-hidden " +
        (props.visible ? "h-5" : "h-0")
      }
    >
      {props.children}
    </p>
  );
}
