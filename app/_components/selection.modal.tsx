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
import { isSelectionStarted, isMovingStarted, store } from "../_store/state";
import IconButton from "./icon-button";
import { DeleteContext } from "./delete.modal";
import { db, IProject, ICategory } from "../_store/db";

type SelectionDestination = {
  feature?: "category" | "project";
  id?: ICategory["id"] | IProject["id"];
};
export const SelectionContext = createContext<{
  destination: SelectionDestination;
}>({
  destination: {},
});

export default function SelectionModal(props: { children: React.ReactNode }) {
  const deleteModal = useContext(DeleteContext);
  const ref = useRef<HTMLDialogElement>(null);
  const dest = useRef<SelectionDestination>({});
  const [isMoving, setMoving] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isSelectionStarted.value || isMovingStarted.value) dialog.show();
    else dialog.close();
  });

  useSignalEffect(() => {
    if (isSelectionStarted.value || isMovingStarted.value) {
      ref.current?.show();
    } else ref.current?.close();
  });

  function onExit() {
    setMoving(false);
    batch(() => {
      emptyMovings();
      emptySelections();
    });
  }

  function onSelectAll(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    batch(addViewToSelections);
  }

  function onMove(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMoving(true);
    batch(() => {
      addSelectionsToMovings();
      emptySelections();
    });
  }

  /**
   *
   * @param e
   * @todo implement onPaste
   */
  async function onPaste(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const cat = store.moving.category;
    const prj = store.moving.project;
    const task = store.moving.task;
    const { feature, id } = dest.current;
    if (feature !== undefined && id !== undefined) {
      if (cat.value.length > 0) {
        db.categories.bulkUpdate(
          cat.value.map((c) => ({
            key: c,
            changes: { [feature]: id },
          })),
        );
      }
      if (prj.value.length > 0) {
        db.projects.bulkUpdate(
          cat.value.map((p) => ({
            key: p,
            changes: { [feature]: id },
          })),
        );
      }
      if (task.value.length > 0) {
        db.tasks.bulkUpdate(
          task.value.map((t) => ({
            key: t,
            changes: { [feature]: id },
          })),
        );
      }
    }
    onExit();
  }

  async function onDelete() {
    const cats = unique(
      (
        await Promise.all(
          store.selection.category.value.map(
            async (c) => await db.extractCategories(c),
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
            async (p) => await db.extractProjects(p),
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
        onExit();
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
    <SelectionContext.Provider
      value={{
        set destination(target: SelectionDestination) {
          Object.assign(dest.current, target);
        },
      }}
    >
      <dialog
        id="selection"
        ref={ref}
        className="dropdown-modal peer fixed z-10 mt-0 w-full min-w-0 max-w-screen-sm rounded-3xl rounded-t-none bg-primary-700 text-white"
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
          {isMoving ? (
            <span className="grid gap-1 text-xs">
              <IconButton
                className="tap-primary-800 ico-sm mx-auto bg-primary-800"
                icon="Clipboard"
                onClick={onPaste}
              />
              <p>Paste</p>
            </span>
          ) : (
            <>
              <span className="grid gap-1 text-xs">
                <IconButton
                  className="tap-primary-800 ico-sm mx-auto bg-primary-800"
                  icon="Move"
                  onClick={onMove}
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
            </>
          )}
        </form>
      </dialog>
      {props.children}
    </SelectionContext.Provider>
  );
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function emptySelections() {
  store.selection.category.value = [];
  store.selection.project.value = [];
  store.selection.task.value = [];
}

function emptyMovings() {
  store.moving.category.value = [];
  store.moving.project.value = [];
  store.moving.task.value = [];
}

function addSelectionsToMovings() {
  store.moving.category.value = store.selection.category.value;
  store.moving.project.value = store.selection.project.value;
  store.moving.task.value = store.selection.task.value;
}

function addViewToSelections() {
  store.selection.category.value = store.view.category.value;
  store.selection.project.value = store.view.project.value;
  store.selection.task.value = store.view.task.value;
}
