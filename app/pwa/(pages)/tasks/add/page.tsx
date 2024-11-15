"use client";
// Types and Constants
import type { IProject, ISubTask, ICategory, ITask } from "@/app/_store/db";
import { Priority } from "@/app/_store/data";
// Signals
import { TaskFormDataSignal } from "@/app/_store/state";
// Hooks
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
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
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/app/_store/db";

export default function AddTaskPage({
  params,
}: {
  params: { id: `${ITask["id"]}` };
}) {
  const id = params.id !== undefined ? parseInt(params.id) : undefined;
  const router = useRouter();
  const calendar = useContext(CalendarContext);
  const clock = useContext(ClockContext);

  const [projects, categories] = useLiveQuery(
    async () => [await db.projects.toArray(), await db.categories.toArray()],
    [],
    [[], []],
  );

  const res = useLiveQuery(
    async () => {
      const results: {
        initial?: ITask;
        project?: IProject;
        category?: ICategory;
      } = {};
      const temp = TaskFormDataSignal.value;

      if (id === undefined) {
        results.initial = temp as ITask;
        if (temp.category !== undefined)
          results.category = await db.categories.get(temp.category);
        if (temp.project !== undefined)
          results.project = await db.projects.get(temp.project);
      } else if (id !== undefined) {
        const initial = await db.tasks.get(id);
        if (initial) {
          Object.assign(initial, temp);
          results.initial = initial;
          if (initial.category)
            results.category = await db.categories.get(
              temp.category ?? initial.category,
            );
          if (initial.project)
            results.project = await db.projects.get(
              temp.project ?? initial.project,
            );
        }
      }
      return results;
    },
    [id, TaskFormDataSignal.value],
    {
      projects: [],
      categories: [],
      initial: undefined,
      project: undefined,
      category: undefined,
    },
  );

  const [state, setState] = useState<Partial<ITask>>(res.initial ?? {});

  useEffect(() => {
    if (res.initial) setState(res.initial);
  }, [res.initial]);

  const form = useRef<HTMLFormElement>(null);
  const subtaskInput = useRef<HTMLInputElement>(null);

  const fuseCats = new Fuse(categories, { keys: ["title"] });
  const fusePrjs = new Fuse(projects, { keys: ["title", "description"] });
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

  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4">
        <div>
          <IconButton
            className="tap-zinc-100 ico-lg text-primary-900"
            icon="ArrowLeft"
            onClick={() => {
              TaskFormDataSignal.value = {};
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
          {id !== undefined ? "Edit" : "New"} Task
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
                TaskFormDataSignal.value = state;
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
        {id !== undefined && (
          <input type="hidden" name="id" defaultValue={id} />
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
              name: projects.find((p) => p.id === state.project)?.title,
              value: state?.project?.toString(),
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
              : projects.map((v) => mapPrjs({ item: v }))}
          </Menu>
          {/* Categories */}
          <Menu
            leadingIcon="FolderPlus"
            label="Category"
            name="category"
            defaultValue={{
              name: categories.find((c) => c.id === state.category)?.title,
              value: state?.category?.toString(),
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
              : categories.map((item) => mapCats({ item }))}
          </Menu>
          {/* Reminder & Priority */}
          <div className="grid grid-cols-2 gap-[inherit]">
            <Menu
              leadingIcon="Bell"
              label="Reminder"
              name="reminder"
              className="menu-zinc-100 tap-zinc-200 menu-md menu-filled text-zinc-600"
              expanded
              onClick={(e) => {
                calendar.onClose = (d) => {
                  if (d) {
                    console.log(typeof d);
                    clock.onClose = (t) => {
                      if (t) {
                        d.setHours(t.getUTCHours(), t.getUTCMinutes(), 0, 0);
                        setState({ ...state, reminder: d });
                      }
                    };
                    clock.showModal();
                  }
                };
                calendar.showModal();
              }}
            >
              {state.reminder && (
                <>
                  <MenuItem
                    value="date"
                    onSelect={() => {
                      const r = state.reminder!;
                      calendar.onClose = (d) => {
                        if (d && d !== r) {
                          d.setHours(r.getHours(), r.getMinutes(), 0, 0);
                          setState({ ...state, reminder: d });
                        } else {
                          setState({ ...state, reminder: undefined });
                        }
                      };
                      calendar.showModal(state.reminder);
                    }}
                    className="menu-item-amber-50 tap-amber-100 text-warning-600"
                  >
                    {date2display(state.reminder)}
                  </MenuItem>
                  <MenuItem
                    value="time"
                    onSelect={() => {
                      clock.onClose = (t) => {
                        if (t) {
                          const r = state.reminder!;
                          r.setHours(t.getUTCHours(), t.getUTCMinutes(), 0, 0);
                          setState({ ...state, reminder: r });
                        } else {
                          setState({ ...state, reminder: undefined });
                        }
                      };
                      clock.showModal();
                    }}
                    className="menu-item-amber-50 tap-amber-100 text-warning-600"
                  >
                    {state.reminder.toLocaleTimeString()}
                  </MenuItem>
                </>
              )}
            </Menu>
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
                onSelect={() => setState({ ...state, priority: 2 })}
                className="menu-item-secondary-50 tap-secondary-100"
              >
                Low
              </MenuItem>
              <MenuItem
                value="1"
                onSelect={() => setState({ ...state, priority: 1 })}
                className="menu-item-warning-50 tap-warning-100"
              >
                Medium
              </MenuItem>
              <MenuItem
                value="0"
                onSelect={() => setState({ ...state, priority: 0 })}
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
                    setState((s) => {
                      s.subtasks?.map((t) => {
                        if (t.id == st.id) st.title = e.target.value.trim();
                        return t;
                      });
                      return s;
                    });
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
                      setState((s) => {
                        s.subtasks = s.subtasks?.filter((s) => s.id !== st.id);
                        return s;
                      });
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
                    subtasks.reduce((p, c) => (p > c.id ? p : c.id), 0) + 1;
                  subtasks.push({
                    id,
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
