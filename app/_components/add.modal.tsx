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
      className="popup-modal bg-transparent ml-auto mt-auto mb-24 mr-6 absolute text-primary-800 origin-bottom-right"
      onClick={handleCancel}
    >
      {buttons.category && (
        <div className="flex gap-2 justify-end py-1">
          <Button
            className="btn-md font-medium bg-zinc-50 tap-zinc-200 w-fit"
            onClick={handleClick(buttons.category)}
          >
            Category
          </Button>
          <IconButton
            icon="FolderPlus"
            className="ico-md bg-zinc-50 tap-zinc-200"
            onClick={handleClick(buttons.category)}
          />
        </div>
      )}
      {buttons.project && (
        <div className="flex gap-2 justify-end py-1">
          <Button
            className="btn-md font-medium bg-zinc-50 tap-zinc-200 w-fit"
            onClick={handleClick(buttons.project)}
          >
            Project
          </Button>
          <IconButton
            icon="Crosshair"
            className="ico-md bg-zinc-50 tap-zinc-200"
            onClick={handleClick(buttons.project)}
          />
        </div>
      )}
      {buttons.task && (
        <div className="flex gap-2 justify-end py-1">
          <Button
            className="btn-md font-medium bg-zinc-50 tap-zinc-200 w-fit"
            onClick={handleClick(buttons.task)}
          >
            Task
          </Button>
          <IconButton
            icon="CheckSquare"
            className="ico-md bg-zinc-50 tap-zinc-200"
            onClick={handleClick(buttons.task)}
          />
        </div>
      )}
    </dialog>
  );
}
