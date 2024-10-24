"use client";
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";
import TextField from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import { modals, store } from "@/app/_store/state";
import { computed } from "@preact/signals-react";
import Fuse from "fuse.js";
import { useRef, useState } from "react";
import { IProject, ISubTask, ICategory } from "@/app/_store/data";
import { useRouter } from "next/navigation";
import { useSignalEffect } from "@preact/signals-react/runtime";

const cats = computed(() => store.value.categories);
const fuseCats = new Fuse(cats.value, { keys: ["title"] });
function mapCats<T extends { item: ICategory }>({ item }: T) {
  return (
    <MenuItem
      key={item.id}
      value={item.id}
      className="menu-item-zinc-100 hover:menu-item-zinc-200 active:menu-item-zinc-300 tap-zinc-300"
    >
      {item.title}
    </MenuItem>
  );
}

const prjs = computed(() => store.value.projects);
const fusePrjs = new Fuse(prjs.value, { keys: ["title", "description"] });
function mapPrjs<T extends { item: IProject }>({ item }: T) {
  return (
    <MenuItem
      key={item.id}
      value={item.id}
      className="menu-item-zinc-100 hover:menu-item-zinc-200 active:menu-item-zinc-300 tap-zinc-300"
    >
      {item.title}
    </MenuItem>
  );
}

type init = {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  project?: string;
  category?: string;
  reminder?: string;
  priority?: string;
} & { [key in `st${string}`]?: string };

export default function AddTaskPage() {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const subtaskInput = useRef<HTMLInputElement>(null);
  const [catSearch, setCatSearch] = useState<string>("");
  const [prjSearch, setPrjSearch] = useState<string>("");
  const [subtasks, setSubTasks] = useState<ISubTask[]>([]);

  const [err, setError] = useState({
    title: false,
    date: false,
    time: false,
  });

  const [initialValues, setInitialValues] = useState<init>({});
  useSignalEffect(() => {
    const time = modals.clock.value.value;
    if (time.length > 0) setError((e) => ({ ...e, time: false }));
    const date = modals.calendar.value.value;
    if (date.length > 0) setError((e) => ({ ...e, date: false }));
    setInitialValues({
      time,
      date,
    });
  });
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
        <h1 className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          New Task
        </h1>
        <div>
          <IconButton
            onClick={() => {
              const f = form.current;
              if (!f) return;
              if (f.checkValidity()) {
                f.submit();
              }
            }}
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowRight"
          ></IconButton>
        </div>
      </header>
      <form
        ref={form}
        action="./verify"
        method="GET"
        className="flex flex-col h-full"
        onSubmit={(e) => e.preventDefault()}
      >
        <section className="grid grid-flow-row gap-4 px-4 h-fit pt-10">
          {/* Title */}
          <TextField
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
              required
              onInvalid={(e) => {
                err.title = true;
              }}
              onBlur={(e) => {
                setError((err) => ({
                  ...err,
                  title: !e.target.checkValidity(),
                }));
              }}
              placeholder="Title*"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400 peer"
            />
          </TextField>
          {/* Description */}
          <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors">
            <Icon
              label="PlusCircle"
              className="ico-md group-focus-within:text-zinc-400"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
            />
          </TextField>
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
                  defaultValue={initialValues.date}
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
                  defaultValue={initialValues.time}
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
            className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
          >
            <MenuItem searchbar className="">
              <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors rounded-none">
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
              </TextField>
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
            className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
          >
            <MenuItem searchbar className="">
              <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors rounded-none">
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
              </TextField>
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
              className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
            >
              <MenuItem
                value="0"
                className="menu-item-secondary-50 tap-secondary-100"
              >
                Low
              </MenuItem>
              <MenuItem
                value="0"
                className="menu-item-warning-50 tap-warning-100"
              >
                Medium
              </MenuItem>
              <MenuItem value="0" className="menu-item-error-50 tap-error-100">
                High
              </MenuItem>
            </Menu>
          </div>
        </section>
        <section className="place-self-end w-full h-full flex flex-col justify-end">
          {subtasks.map((st) => (
            <TextField
              key={st.id}
              className=" text-input-sm text-white bg-primary-800 group *:transition-colors rounded-none border-b-2 px-1 border-primary-600"
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
                  const input = e.target;
                  const value = input.value;
                  const storedValue = subtasks.find((t) => t.id == st.id);
                  if (storedValue && value !== storedValue?.title) {
                    setSubTasks(
                      subtasks.map((t) => {
                        if (t.id == storedValue.id) {
                          return { ...storedValue, title: value.trim() };
                        }
                        return t;
                      })
                    );
                  }
                }}
                className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
              />
              <IconButton
                icon="X"
                className="ico-sm rounded-none tap-primary-600"
                onClick={() => {
                  setSubTasks(subtasks.filter((v) => v.id !== st.id));
                }}
              />
            </TextField>
          ))}

          <TextField className=" text-input-md text-white bg-primary-800 group *:transition-colors rounded-none">
            <input
              ref={subtaskInput}
              type="text"
              placeholder="Add Sub-task"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
            />
            <IconButton
              icon="Plus"
              className="ico-md rounded-none tap-primary-600"
              onClick={() => {
                const val = subtaskInput.current?.value;
                if (val) {
                  setSubTasks([
                    ...subtasks,
                    {
                      id:
                        subtasks.reduce((p, c) => (p > c.id ? p : c.id), 0) + 1,
                      status: false,
                      title: val.trim(),
                    },
                  ]);
                  subtaskInput.current.value = "";
                }
              }}
            />
          </TextField>
        </section>
      </form>
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
