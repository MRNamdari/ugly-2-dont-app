"use client";

import { batch, useSignalEffect } from "@preact/signals-react";
import {
  createContext,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  useContext,
} from "react";
import { isSelectionStarted, SignalValue, store } from "../_store/state";
import IconButton from "./icon-button";
import { DeleteContext } from "./delete.modal";
import { db, ExtractCategories, ExtractProjects } from "../_store/db";

export const SelectionContext = createContext({});

export default function SelectionModal(props: { children: React.ReactNode }) {
  const deleteModal = useContext(DeleteContext);
  const ref = useRef<HTMLDialogElement>(null);
  const [selection, setSelection] = useState({
    category: [] as number[],
    project: [] as number[],
    task: [] as number[],
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // dialog.onclose = onExit;
    if (isSelectionStarted.value) dialog.show();
    else dialog.close();
  });

  useSignalEffect(() => {
    if (isSelectionStarted.value) {
      setSelection({
        category: store.selection.category.value,
        project: store.selection.project.value,
        task: store.selection.task.value,
      });
      ref.current?.show();
    } else {
      ref.current?.close();
    }
  });

  function onExit() {
    batch(() => {
      store.selection.category.value = [];
      store.selection.project.value = [];
      store.selection.task.value = [];
    });
  }

  function onSelectAll(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    batch(() => {
      store.selection.category.value = store.view.category.value;
      store.selection.project.value = store.view.project.value;
      store.selection.task.value = store.view.task.value;
    });
  }

  async function onDelete() {
    const cats = unique(
      (
        await Promise.all(
          store.selection.category.value.map(
            async (c) => await ExtractCategories(c),
          ),
        )
      ).flat(),
    );
    const projectsWhitinCats = (
      await db.projects.where("category").anyOf(cats).toArray()
    ).map((p) => p.id);
    const tasksWhitinCats = (
      await db.tasks.where("category").anyOf(cats).toArray()
    ).map((t) => t.id);
    const prjs = unique(
      (
        await Promise.all(
          store.selection.project.value.map(
            async (p) => await ExtractProjects(p),
          ),
        )
      )
        .flat()
        .concat(projectsWhitinCats),
    );
    const tasksWhitinPrjs = (
      await db.tasks.where("project").anyOf(prjs).toArray()
    ).map((t) => t.id);
    const tasks = unique(
      store.selection.task.value.concat(tasksWhitinPrjs, tasksWhitinCats),
    );

    deleteModal.onClose = async (value) => {
      if (value === "true") {
        await db.tasks.bulkDelete(tasks);
        await db.projects.bulkDelete(prjs);
        await db.categories.bulkDelete(cats);
      }
      ref.current?.close();
    };

    const count = [cats.length, prjs.length, tasks.length]
      .map((n, i) => {
        switch (i) {
          case 0:
            return n > 0 ? n + (n > 1 ? " categories" : " category") : "";
          case 1:
            return n > 0 ? n + " project" + (n > 1 ? "s" : "") : "";
          case 2:
            return n > 0 ? n + " task" + (n > 1 ? "s" : "") : "";
          default:
            return "";
        }
      })
      .filter((s) => s !== "");
    const msg =
      count.length > 1
        ? "You're actually deleting " +
          count.join(", ") +
          "!\n It's irreversible, you sure"
        : "You're sure wanna delete " + count[0] + "?";
    deleteModal.showModal(msg);
  }
  return (
    <SelectionContext.Provider value={{}}>
      <dialog
        ref={ref}
        className="dropdown-modal fixed z-10 mt-0 w-full min-w-0 max-w-screen-sm rounded-3xl rounded-t-none bg-primary-700 pb-8 text-white after:absolute after:bottom-4 after:left-1/2 after:block after:h-1 after:w-1/4 after:-translate-x-1/2 after:rounded-sm after:bg-primary-800"
      >
        <form
          method="dialog"
          className="flex items-center gap-2 whitespace-nowrap p-4 text-center"
        >
          <span className="grid gap-1 text-xs">
            <IconButton
              className="tap-primary-800 ico-sm mx-auto bg-primary-800"
              icon="X"
              onClick={onExit}
            />
            <p>Exit</p>
          </span>
          <div className="w-full"></div>
          <span className="grid gap-1 text-xs">
            <IconButton
              className="tap-primary-800 ico-sm mx-auto bg-primary-800"
              icon="Move"
            />
            <p>Move</p>
          </span>
          <span className="grid gap-1 text-xs">
            <IconButton
              className="tap-primary-800 ico-sm mx-auto bg-primary-800"
              icon="Trash"
              onClick={onDelete}
            />
            <p>Delete</p>
          </span>
          <span className="grid gap-1 text-xs">
            <IconButton
              className="tap-primary-800 ico-sm mx-auto bg-primary-800"
              icon="CheckCircle"
              onClick={onSelectAll}
            />
            <p>Select All</p>
          </span>
        </form>
      </dialog>
      {props.children}
    </SelectionContext.Provider>
  );
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
