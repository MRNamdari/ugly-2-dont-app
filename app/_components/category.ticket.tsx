import { motion, PanInfo } from "framer-motion";
import { ICategory } from "../_store/data";
import Icon from "./icon";
import { useState, MouseEvent } from "react";
import {
  AddToSelection,
  CategoryInfo,
  isSelectionStarted,
  modals,
  RemoveCategoryById,
  RemoveFromSelection,
  store,
} from "../_store/state";
import { useRouter } from "next/navigation";
import { useSignalEffect } from "@preact/signals-react";

const selection = store.selection;

export default function CategoryTicket(props: ICategory) {
  const router = useRouter();
  const [isSelected, setSelection] = useState<boolean>();
  const [info, setInfo] = useState({ categories: 0, projects: 0, tasks: 0 });

  useSignalEffect(() => {
    new Promise<{ categories: number; projects: number; tasks: number }>(
      (resolve) => resolve(CategoryInfo(props.id).value),
    ).then(setInfo);
  });

  function ContextMenuHandler(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSelection(true);
    selection.value = [...selection.value, props.id];
  }
  function DragEndHandler(e: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > 90)
      info.offset.x > 0 ? onDelete() : console.log("Edit " + props.title);
  }
  function onDelete() {
    modals.delete.message.value = `Sure wanna delete “${props.title}” and all its tasks, projects & categories?`;
    const deleteModal = document.getElementById("delete") as HTMLDialogElement;
    deleteModal.onclose = (e) => {
      if (deleteModal.returnValue === "true") {
        RemoveCategoryById(props.id);
      }
    };
    setTimeout(() => deleteModal.showModal(), 200);
  }
  return (
    <motion.article
      id={props.id}
      initial={{ opacity: 0, marginBottom: 0 }}
      animate={{ opacity: 1, marginBottom: "1rem" }}
      exit={{ opacity: 0, marginBottom: 0 }}
      className="relative mb-4"
      onClick={() => router.replace("/pwa/categories/details/" + props.id)}
    >
      <div className="absolute left-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-start rounded-l-2xl bg-error-100 p-4">
        <Icon label="Trash" size={24} className="size-6 text-error-500" />
      </div>
      <div className="absolute right-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-end rounded-r-2xl bg-warning-100 p-4">
        <Icon label="Edit" size={24} className="size-6 text-warning-600" />
      </div>
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragTransition={{ bounceStiffness: 400 }}
        className="grid grid-cols-[3rem_auto_2rem] items-center rounded-3xl bg-gray-100 p-6 py-2 aria-selected:bg-secondary-50"
        aria-selected={isSelected}
        onClick={() => {
          if (isSelectionStarted.value) {
            if (isSelected) {
              RemoveFromSelection(props.id);
              setSelection(false);
            } else {
              AddToSelection(props.id);
              setSelection(true);
            }
            return;
          }
        }}
        onContextMenu={ContextMenuHandler}
        onDragEnd={DragEndHandler}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 40" height="28">
          <rect
            x="0"
            y="5"
            width="56"
            height="35"
            className="fill-warning-300"
            rx="5"
          ></rect>
          <rect
            x="0"
            y="5"
            width="56"
            height="5"
            className="fill-warning-500"
          ></rect>
          <polygon
            points="0,0 20,0 25,10 0,10"
            className="fill-warning-500"
          ></polygon>
          <polygon
            points="56,0 36,0 31,10 56,10"
            className="fill-warning-300"
          ></polygon>
        </svg>
        <span className="h-fit">
          <h4 className="self-center text-base font-medium">{props.title}</h4>
          <h5 className="text-xs text-primary-600">
            {info.tasks > 0 &&
              info.tasks + " Task" + (info.tasks > 1 ? "s" : "")}
            {info.tasks > 0 && info.projects > 0 && " • "}
            {info.projects > 0 &&
              info.projects + " Project" + (info.projects > 1 ? "s" : "")}
          </h5>
        </span>

        <Icon
          label="ChevronRight"
          className="tap-gray-200 ico-md text-primary-700"
        />
      </motion.div>
    </motion.article>
  );
}
