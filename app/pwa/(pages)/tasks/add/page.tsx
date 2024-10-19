"use client";
import Menu, { MenuItem } from "@/app/_components/menu";
import IconButton from "@/app/_components/icon-button";
import Button from "@/app/_components/button";

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
        <div>
          <IconButton
            className="fab-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          ></IconButton>
        </div>
        <h1 className="text-3xl text-center self-end font-medium">New Task</h1>
        <div>
          <IconButton
            className="fab-lg tap-zinc-100 text-primary-900"
            icon="ArrowRight"
          ></IconButton>
        </div>
      </header>
      <div></div>
    </>
  );
}
