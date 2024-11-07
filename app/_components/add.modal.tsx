"use client";
import Button from "./button";
import IconButton from "./icon-button";
import { MouseEvent, useRef, useState } from "react";
import { modals } from "../_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { useRouter } from "next/navigation";

modals.add.buttons;
export default function AddModal() {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [buttons, setButtons] = useState<{
    category?: string;
    project?: string;
    task?: string;
  }>({});
  useSignalEffect(() => {
    setButtons(modals.add.buttons.value);
  });
  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    const modal = e.target as HTMLDialogElement;
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) modal.close();
  }
  function handleClick(href: string) {
    return function ButtonClickHandler(e: MouseEvent<HTMLButtonElement>) {
      ref.current?.close();
      router.push(href);
    };
  }
  return (
    <dialog
      ref={ref}
      id="add"
      className="popup-modal absolute mb-24 ml-auto mr-6 mt-auto origin-bottom-right bg-transparent text-primary-800"
      onClick={handleCancel}
    >
      {buttons.category && (
        <div className="flex justify-end gap-2 py-1">
          <Button
            className="tap-zinc-200 btn-md w-fit bg-zinc-50 font-medium"
            onClick={handleClick(buttons.category)}
          >
            Category
          </Button>
          <IconButton
            icon="FolderPlus"
            className="tap-zinc-200 ico-md bg-zinc-50"
            onClick={handleClick(buttons.category)}
          />
        </div>
      )}
      {buttons.project && (
        <div className="flex justify-end gap-2 py-1">
          <Button
            className="tap-zinc-200 btn-md w-fit bg-zinc-50 font-medium"
            onClick={handleClick(buttons.project)}
          >
            Project
          </Button>
          <IconButton
            icon="Crosshair"
            className="tap-zinc-200 ico-md bg-zinc-50"
            onClick={handleClick(buttons.project)}
          />
        </div>
      )}
      {buttons.task && (
        <div className="flex justify-end gap-2 py-1">
          <Button
            className="tap-zinc-200 btn-md w-fit bg-zinc-50 font-medium"
            onClick={handleClick(buttons.task)}
          >
            Task
          </Button>
          <IconButton
            icon="CheckSquare"
            className="tap-zinc-200 ico-md bg-zinc-50"
            onClick={handleClick(buttons.task)}
          />
        </div>
      )}
    </dialog>
  );
}
