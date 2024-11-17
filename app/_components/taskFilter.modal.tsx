"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  MouseEvent,
} from "react";
import TextInput from "./text-input";
import Button from "./button";
import Menu, { MenuItem } from "./menu";
import Icon from "./icon";
import Fuse from "fuse.js";
import { CalendarContext } from "./calendar.modal";
import { ClockContext } from "./clock.modal";
import { useLiveQuery } from "dexie-react-hooks";
import { db, ICategory, IProject, ITask } from "../_store/db";
import { date2display, timeToLocalTime } from "../_store/util";
import { Priority } from "../_store/data";

type TaskFilterIndex = {
  title?: string;
  category?: ICategory["id"];
  project?: IProject["id"];
  date?: Date;
  time?: Date;
  status?: boolean;
  priority?: 0 | 1 | 2;
};
type TaskFilterContextType = {
  showModal: () => void;
  onClose: (filter?: TaskFilterIndex) => void;
  close: () => void;
};
export const TaskFilterContext = createContext<TaskFilterContextType>({
  showModal() {},
  onClose() {},
  close() {},
});

export default function TaskFilterModal(props: { children: React.ReactNode }) {
  const calendar = useContext(CalendarContext);
  const clock = useContext(ClockContext);
  const [state, setState] = useState<TaskFilterIndex>({
    title: "",
    status: false,
  });

  const [visibleModal, setVisibleModal] = useState<"calendar" | "clock">();
  const form = useRef<HTMLFormElement>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const constants = useRef<{ cb: TaskFilterContextType["onClose"] }>({
    cb: () => {},
  });
  const [isPending, startTransition] = useTransition();

  function showModal() {
    startTransition(() => {
      ref.current?.showModal();
    });
  }

  function close() {
    startTransition(() => {
      ref.current?.close();
    });
  }

  function reset() {
    startTransition(() => {
      setState({});
      form.current?.reset();
    });
  }

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.onclose = () => {
      if (!visibleModal && dialog.returnValue !== "cancel") {
        constants.current.cb(state);
        reset();
      }
    };
  });

  const [projects, categories] = useLiveQuery(
    async () => [await db.projects.toArray(), await db.categories.toArray()],
    [],
    [[], []],
  );

  const fuseCats = new Fuse(categories, { keys: ["title"] });
  const fusePrjs = new Fuse(projects, { keys: ["title", "description"] });

  const [catSearch, setCatSearch] = useState<string>("");
  const [prjSearch, setPrjSearch] = useState<string>("");
  function mapCats<T extends { item: ICategory }>({ item }: T) {
    return (
      <MenuItem
        key={item.id}
        value={item.id.toString()}
        onSelect={(category) =>
          setState({ ...state, category: parseInt(category) })
        }
        className="menu-item-primary-800 tap-primary-900 hover:menu-item-primary-900 active:menu-item-primary-900"
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
        className="menu-item-primary-800 tap-primary-900 hover:menu-item-primary-900 active:menu-item-primary-900"
      >
        {item.title}
      </MenuItem>
    );
  }
  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    const dialog = ref.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      reset();
      dialog.close("cancel");
    }
  }
  return (
    <TaskFilterContext.Provider
      value={{
        showModal,
        close,
        set onClose(cb: TaskFilterContextType["onClose"]) {
          constants.current.cb = cb;
        },
      }}
    >
      <dialog
        onClick={handleCancel}
        ref={ref}
        id="task-filter"
        className="dropdown-modal relative mt-0 w-full min-w-0 max-w-screen-sm rounded-3xl rounded-t-none bg-primary-700 pb-8 after:absolute after:bottom-4 after:left-1/2 after:block after:h-1 after:w-1/4 after:-translate-x-1/2 after:rounded-sm after:bg-primary-800"
      >
        <form
          method="dialog"
          ref={form}
          className="grid gap-2 px-4 pt-4 text-primary-50"
        >
          <TextInput className="group text-input-sm bg-primary-800 *:transition-colors">
            <input
              type="text"
              name="title"
              onBlur={(e) => {
                const isValid = e.target.checkValidity();
                if (isValid) {
                  setState({ ...state, title: e.target.value.trim() });
                }
              }}
              placeholder="Title"
              className="peer placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
            />
          </TextInput>
          <div className="grid grid-cols-2 gap-[inherit]">
            <span>
              <Button
                leadingIcon="Calendar"
                className="tap-primary-900 btn-sm bg-primary-800"
                onClick={(e) => {
                  e.preventDefault();
                  ref.current?.close();
                  calendar.onClose = (d) => {
                    setState((s) => {
                      s.date = d;
                      return s;
                    });
                    setVisibleModal(undefined);
                    ref.current?.showModal();
                  };
                  setVisibleModal("calendar");
                  calendar.showModal(state?.date);
                }}
              >
                {state?.date ? date2display(state.date) : "Date"}
                <input
                  type="date"
                  name="date"
                  hidden
                  defaultValue={state?.date?.toISOString().slice(0, 10)}
                />
              </Button>
            </span>
            <span>
              <Button
                leadingIcon="Clock"
                className="tap-primary-900 btn-sm bg-primary-800"
                onClick={(e) => {
                  e.preventDefault();
                  ref.current?.close("clock");
                  clock.onClose = (time) => {
                    setState((s) => {
                      s.time = time;
                      return s;
                    });
                    setVisibleModal(undefined);
                    ref.current?.showModal();
                  };
                  setVisibleModal("clock");
                  clock.showModal(state.time);
                }}
              >
                {state.time ? timeToLocalTime(state.time) : "Time"}
                <input
                  type="time"
                  name="time"
                  hidden
                  defaultValue={state?.time?.toTimeString().slice(0, 8)}
                />
              </Button>
            </span>
          </div>
          {/* Project */}
          <Menu
            leadingIcon="Crosshair"
            label="Project"
            name="project"
            className="menu-primary-800 tap-primary-900 menu-sm menu-filled"
          >
            <MenuItem searchbar className="border-b-2 border-primary-600">
              <TextInput className="group text-input-sm rounded-none bg-primary-800 *:transition-colors">
                <Icon label="Search" className="ico-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
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
              name: categories.find((c) => c.id == state?.category)?.title,
              value: state?.category?.toString(),
            }}
            className="menu-primary-800 tap-primary-900 menu-sm menu-filled"
          >
            <MenuItem searchbar className="border-b-2 border-primary-600">
              <TextInput className="group text-input-sm rounded-none *:transition-colors">
                <Icon label="Search" className="ico-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
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
              : categories.map((v) => mapCats({ item: v }))}
          </Menu>
          <div className="grid grid-cols-2 gap-[inherit]">
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
              className="menu-primary-800 tap-primary-900 menu-sm menu-filled"
            >
              <MenuItem
                value="2"
                onSelect={() => setState({ ...state, priority: 2 })}
                className="menu-item-primary-800 tap-primary-600"
              >
                Low
              </MenuItem>
              <MenuItem
                value="1"
                onSelect={() => setState({ ...state, priority: 1 })}
                className="menu-item-primary-800 tap-primary-600"
              >
                Medium
              </MenuItem>
              <MenuItem
                value="0"
                onSelect={() => setState({ ...state, priority: 0 })}
                className="menu-item-primary-800 tap-primary-600"
              >
                High
              </MenuItem>
            </Menu>
            <div className="btn-sm relative bg-primary-800">
              <input
                type="checkbox"
                name="status"
                defaultChecked={state.status}
                onChange={(e) => {
                  setState({ ...state, status: e.target.checked });
                }}
                className="peer absolute inset-0 z-10 h-full w-full appearance-none"
              />
              <div className="h-4 w-1/2 rounded-xl bg-primary-700 text-center leading-none text-primary-400 transition-all peer-checked:translate-x-full peer-checked:text-inherit">
                Finished
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[inherit]">
            <Button
              onClick={reset}
              className="tap-primary-800 btn-md justify-center border-2 border-primary-800"
            >
              Reset Filter
            </Button>
            <Button
              onClick={close}
              value="apply"
              className="tap-primary-800 btn-md justify-center bg-primary-800"
            >
              Apply
            </Button>
          </div>
        </form>
      </dialog>
      {props.children}
    </TaskFilterContext.Provider>
  );
}
