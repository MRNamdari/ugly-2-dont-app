"use client";
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";
import TextField from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";
import { modals, store } from "@/app/_store/state";
import { computed } from "@preact/signals-react";
import {
  date2display,
  ICategory,
  timeToLocalTime,
} from "@/app/_components/util";
import Fuse, { FuseResult } from "fuse.js";
import { useState } from "react";
import { IProject } from "@/app/_store/data";

const date = computed(() =>
  modals.calendar.value ? date2display(modals.calendar.value) : "Date*"
);

const time = computed(() =>
  modals.clock.value ? timeToLocalTime(modals.clock.value) : "Time*"
);

// const cats = computed(() =>
//   store.value.categories.map((c) => (
//     <MenuItem
//       key={c.id}
//       value={c.id}
//       className="menu-item-zinc-100 hover:menu-item-zinc-200 active:menu-item-zinc-300"
//     >
//       {c.title}
//     </MenuItem>
//   ))
// );

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

export default function AddTaskPage() {
  const ops = [
    { name: "First Item 01", value: "1" },
    { name: "Second Item 02", value: "2" },
    { name: "Third Item 03", value: "3" },
    { name: "Fourth Item 04", value: "4" },
    { name: "Fifth Item 05", value: "5" },
    { name: "Sixth Item 06", value: "6" },
  ];

  const items = ops.map((f, i) => (
    <MenuItem
      key={i}
      className=" menu-item-primary-700 tap-error-100"
      value={f.value}
      onSelect={(e) => {
        console.log(e);
      }}
    >
      {f.name}
    </MenuItem>
  ));
  const [catSearch, setCatSearch] = useState<string>("");
  const [prjSearch, setPrjSearch] = useState<string>("");
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] px-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          ></IconButton>
        </div>
        <h1 className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          New Task
        </h1>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowRight"
          ></IconButton>
        </div>
      </header>
      <form
        className="flex flex-col h-full"
        onSubmit={(e) => e.preventDefault()}
      >
        <section className="grid grid-flow-row gap-4 px-4 h-fit pt-10">
          <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors">
            <input
              type="text"
              placeholder="Title*"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
            />
          </TextField>
          <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors">
            <Icon
              label="PlusCircle"
              className="ico-md group-focus-within:text-zinc-400"
            />
            <input
              type="text"
              placeholder="Description"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
            />
          </TextField>
          <div className="grid grid-cols-2 gap-[inherit]">
            <Button
              leadingIcon="Calendar"
              className="btn-md bg-zinc-100 text-zinc-600 tap-zinc-200"
              onClick={() => {
                const cal = document.querySelector(
                  "#calendar"
                ) as HTMLDialogElement;
                cal.showModal();
              }}
            >
              {date}
            </Button>
            <Button
              leadingIcon="Clock"
              className="btn-md bg-zinc-100 text-zinc-600 tap-zinc-200"
              onClick={() => {
                const clk = document.querySelector(
                  "#clock"
                ) as HTMLDialogElement;
                clk.showModal();
              }}
            >
              {time}
            </Button>
          </div>
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
          <TextField className=" text-input-sm text-white bg-primary-800 group *:transition-colors rounded-none border-b-2 px-1 border-primary-600">
            <Icon
              label="Hash"
              className="ico-sm group-focus-within:text-primary-400"
            />
            <input
              type="text"
              defaultValue="First Sub-task"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
            />
            <IconButton
              icon="X"
              className="ico-sm rounded-none tap-primary-600"
            />
          </TextField>
          <TextField className=" text-input-md text-white bg-primary-800 group *:transition-colors rounded-none">
            <input
              type="text"
              placeholder="Add Sub-task"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
            />
            <IconButton
              icon="Plus"
              className="ico-md rounded-none tap-primary-600"
            />
          </TextField>
        </section>
      </form>
    </>
  );
}
