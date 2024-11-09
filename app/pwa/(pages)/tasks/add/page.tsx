"use client";
// Types and Constants
import type {
  IProject,
  ISubTask,
  ICategory,
  ITask,
  TaskId,
} from "@/app/_store/data";
import { Priority } from "@/app/_store/data";
// Signals
import { computed } from "@preact/signals-react";
import { SelectTaskById, TaskFormDataSignal, store } from "@/app/_store/state";
// Hooks
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
// Components
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import { motion } from "framer-motion";
import { CalendarContext } from "@/app/_components/calendar.modal";
import { date2display, timeToLocalTime } from "@/app/_components/util";
import { ClockContext } from "@/app/_components/clock.modal";

const cats = computed(() => store.categories.value);
const fuseCats = new Fuse(cats.value, { keys: ["title"] });

const prjs = computed(() => store.projects.value);
const fusePrjs = new Fuse(prjs.value, { keys: ["title", "description"] });

export default function AddTaskPage({ params }: { params: { id: TaskId } }) {
  const router = useRouter();
  const calendar = useContext(CalendarContext);
  const clock = useContext(ClockContext);
  const [state, setState] = useState<Partial<ITask>>(SelectTaskById(params.id));
  const form = useRef<HTMLFormElement>(null);
  const subtaskInput = useRef<HTMLInputElement>(null);

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
        value={item.id}
        onSelect={(categoryId) => setState({ ...state, categoryId })}
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
        value={item.id}
        onSelect={(projectId) => setState({ ...state, projectId })}
        className="menu-item-zinc-100 tap-zinc-300 hover:menu-item-zinc-200 active:menu-item-zinc-300"
      >
        {item.title}
      </MenuItem>
    );
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
          />
        </div>
        <motion.h1
          initial={{ transform: "translate(0,-200%)", opacity: 0 }}
          animate={{ transform: "translate(0,0)", opacity: 1 }}
          exit={{ transform: "translate(0,-200%)", opacity: 0 }}
          className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
        >
          {params.id ? "Edit" : "New"} Task
        </motion.h1>
        <div>
          <IconButton
            initial={{ opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              const f = form.current;
              if (!f) return;
              if (f.checkValidity()) {
                if (state !== undefined) TaskFormDataSignal.value = state;
                router.push("/pwa/tasks/verify");
              }
            }}
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowRight"
          />
        </div>
      </header>
      <motion.form
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
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
              defaultValue={state?.title}
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
              defaultValue={state?.description}
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
                    setState((s) => ({ ...s, date: d?.toISOString() }));
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
                  defaultValue={state?.date}
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
                  defaultValue={state?.time}
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
              name: prjs.value.find((p) => p.id == state?.projectId)?.title,
              value: state?.projectId,
            }}
            className="menu-zinc-100 tap-zinc-200 menu-md menu-filled text-zinc-600"
          >
            <MenuItem searchbar className="">
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
              : prjs.value.map((v) => mapPrjs({ item: v }))}
          </Menu>
          {/* Categories */}
          <Menu
            leadingIcon="FolderPlus"
            label="Category"
            name="category"
            defaultValue={{
              name: cats.value.find((c) => c.id == state?.categoryId)?.title,
              value: state?.categoryId,
            }}
            className="menu-zinc-100 tap-zinc-200 menu-md menu-filled text-zinc-600"
          >
            <MenuItem searchbar className="">
              <TextInput className="group text-input-md rounded-none bg-zinc-100 text-zinc-600 *:transition-colors">
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
              className="tap-zinc-200 btn-md bg-zinc-100 text-zinc-600"
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
        <section className="flex h-full w-full flex-col justify-end place-self-end">
          {state?.subtasks &&
            state?.subtasks.map((st) => (
              <TextInput
                key={st.id}
                className="group text-input-sm rounded-none border-b-2 border-primary-600 bg-primary-800 px-1 text-white *:transition-colors"
              >
                <Icon
                  label="Hash"
                  className="ico-sm group-focus-within:text-primary-400"
                />
                <input
                  type="text"
                  name={`st${st.id}`}
                  defaultValue={st.title}
                  onBlur={(e) => {
                    e.preventDefault();
                    const input = e.target;
                    const value = input.value;
                    const storedValue = state.subtasks?.find(
                      (t) => t.id == st.id,
                    );
                    if (storedValue && value !== storedValue?.title) {
                      setState({ ...state, [`st${st.id}`]: value.trim() });
                    }
                  }}
                  className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
                />
                <input
                  type="hidden"
                  name={`ss${st.id}`}
                  defaultValue={st.status ? "1" : "0"}
                />
                <IconButton
                  icon="X"
                  className="tap-primary-600 ico-sm rounded-none"
                  onClick={(e) => {
                    e.preventDefault();
                    let subtasks: ISubTask[] | undefined;
                    if ((subtasks = state.subtasks)) {
                      setState((state) => ({
                        ...state,
                        subtasks: subtasks?.filter((s) => s.id !== st.id),
                      }));
                    }
                  }}
                />
              </TextInput>
            ))}

          <TextInput className="group text-input-md rounded-none bg-primary-800 text-white *:transition-colors">
            <input
              ref={subtaskInput}
              type="text"
              placeholder="Add Sub-task"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
            />
            <IconButton
              icon="Plus"
              className="tap-primary-600 ico-md rounded-none"
              onClick={(e) => {
                e.preventDefault();
                const val = subtaskInput.current?.value;
                if (val) {
                  const subtasks = state?.subtasks || [];
                  const id =
                    subtasks.reduce(
                      (p, c) => (p > parseInt(c.id) ? p : parseInt(c.id)),
                      0,
                    ) + 1;
                  subtasks.push({
                    id: id.toString(),
                    status: false,
                    title: val.trim(),
                  });
                  setState({
                    ...state,
                    subtasks,
                  });

                  subtaskInput.current.value = "";
                }
              }}
            />
          </TextInput>
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
