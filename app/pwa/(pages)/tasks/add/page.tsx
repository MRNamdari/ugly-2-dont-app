"use client";
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";
import TextField from "@/app/_components/text-input";
import Icon from "@/app/_components/icon";

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
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] px-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          ></IconButton>
        </div>
        <h1 className="text-3xl text-center self-end font-medium">New Task</h1>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowRight"
          ></IconButton>
        </div>
      </header>
      <div className="">
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
              >
                Date*
              </Button>
              <Button
                leadingIcon="Clock"
                className="btn-md bg-zinc-100 text-zinc-600 tap-zinc-200"
              >
                Time*
              </Button>
            </div>
            <Menu
              leadingIcon="Crosshair"
              label="Project"
              className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
            >
              <MenuItem searchbar className="">
                <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors rounded-none">
                  <Icon label="Search" className="ico-sm" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
                  />
                </TextField>
              </MenuItem>
            </Menu>
            <Menu
              leadingIcon="FolderPlus"
              label="Category"
              className=" menu-zinc-100 menu-md menu-filled tap-zinc-200 text-zinc-600"
            >
              <MenuItem searchbar className="">
                <TextField className=" text-input-md text-zinc-600 bg-zinc-100 group *:transition-colors rounded-none">
                  <Icon label="Search" className="ico-sm" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-zinc-400"
                  />
                </TextField>
              </MenuItem>
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
                <MenuItem
                  value="0"
                  className="menu-item-error-50 tap-error-100"
                >
                  High
                </MenuItem>
              </Menu>
            </div>
          </section>
          <section className="place-self-end w-full h-full flex flex-col justify-end">
            <TextField className=" text-input-sm text-white bg-primary-800 group *:transition-colors rounded-none border-b-2 border-primary-600">
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
                className="ico-md rounded-none tap-primary-600"
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
      </div>
    </>
  );
}
