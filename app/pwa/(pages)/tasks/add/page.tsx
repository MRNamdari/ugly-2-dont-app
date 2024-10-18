"use client";
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Fuse from "fuse.js";
import { useState } from "react";

export default function AddTaskPage() {
  const ops = [
    { name: "First Item 01", value: "1" },
    { name: "Second Item 02", value: "2" },
    { name: "Third Item 03", value: "3" },
    { name: "Fourth Item 04", value: "4" },
    { name: "Fifth Item 05", value: "5" },
    { name: "Sixth Item 06", value: "6" },
  ];
  const fuse = new Fuse(ops, {
    keys: ["name"],
  });
  const [pattern, setPattern] = useState<string>("");
  const items = (pattern.length > 0 ? fuse.search(pattern) : ops).map(
    (f, i) => {
      if ("item" in f)
        return (
          <MenuItem
            key={i}
            className=" menu-item-primary-700 hover:menu-item-primary-800 active:menu-item-primary-900 text-zinc-100"
            value={f.item.value}
            onSelect={(e) => {
              console.log(e);
            }}
          >
            {f.item.name}
          </MenuItem>
        );
      return (
        <MenuItem
          key={i}
          className=" menu-item-primary-700 hover:menu-item-primary-800 active:menu-item-primary-900 text-zinc-100"
          value={f.value}
          onSelect={(e) => {
            console.log(e);
          }}
        >
          {f.name}
        </MenuItem>
      );
    }
  );
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] justify-center items-center">
        <div></div>
        <h1 className="text-3xl text-center">New Task</h1>
        <div></div>
      </header>
      <div>
        <Menu
          className="menu-lg active:menu-zinc-200 menu-zinc-100 "
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
              className="w-full bg-inherit text-inherit p-2 outline-none"
              onChange={(e) => {
                if (e.target.value.trim().length) setPattern(e.target.value);
                else setPattern("");
              }}
            />
          </MenuItem>
          {items.length > 0 ? (
            items
          ) : (
            <MenuItem className="menu-item-zinc-200">
              Nothing to see here!
            </MenuItem>
          )}
        </Menu>

        <IconButton href="./" icon="Bluetooth"></IconButton>
      </div>
    </>
  );
}
