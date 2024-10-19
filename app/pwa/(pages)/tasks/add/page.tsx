"use client";
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";

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
      <header className="grid grid-cols-[3rem_1fr_3rem] justify-center items-center">
        <div></div>
        <h1 className="text-3xl text-center">New Task</h1>
        <div></div>
      </header>
      <div>
        <Menu
          className="menu-md menu-outlined menu-primary-800 tap-primary-200 text-primary-900"
          label="Select an Item"
          leadingIcon="Folder"
        >
          <MenuItem
            key="searchbar"
            className=" menu-item-zinc-200 text-zinc-800"
            searchbar
          >
            <input
              type="text"
              className="w-full text-inherit h-full outline-none"
            />
          </MenuItem>
          {items}
        </Menu>

        <IconButton
          href="./"
          onClick={(e) => e.preventDefault()}
          icon="Bluetooth"
          className="icon-xl bg-primary-700 text-white"
        ></IconButton>
      </div>
    </>
  );
}
