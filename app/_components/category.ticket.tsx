import { motion, PanInfo } from "framer-motion";
import { CategorySummary, db, ICategory, IProject, ITask } from "../_store/db";
import Icon from "./icon";
import { useState, MouseEvent, useContext, useRef } from "react";
import {
  AddToSelection,
  IsSelected,
  isSelectionStarted,
  RemoveFromSelection,
  store,
} from "../_store/state";
import { useRouter } from "next/navigation";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from "dexie-react-hooks";
import { DeleteContext } from "./delete.modal";
import { AddEditCategoryContext } from "./addEditCategory.modal";

export default function CategoryTicket(props: ICategory) {
  const deleteModal = useContext(DeleteContext);
  const editModal = useContext(AddEditCategoryContext);
  const router = useRouter();
  const [isSelected, setSelection] = useState<boolean>(
    IsSelected("category", props.id),
  );
  const info = useLiveQuery(
    async () => await CategorySummary(props.id),
    [props.id],
    {
      categoriesId: [] as number[],
      projects: [] as IProject[],
      tasks: [] as ITask[],
    },
  );
  const dragEnd = useRef<{ info: PanInfo | undefined }>({ info: undefined });

  useSignalEffect(() => {
    setSelection(IsSelected("category", props.id));
  });

  function ContextMenuHandler(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    AddToSelection("category", props.id);
  }
  function DragEndHandler(e: any, info: PanInfo) {
    dragEnd.current.info = info;
  }
  function DragTransitionEndHandler() {
    const info = dragEnd.current.info;
    if (info)
      if (Math.abs(info.offset.x) > 90)
        info.offset.x > 0 ? onDelete() : onEdit();
  }
  function onDelete() {
    deleteModal.onClose = async (value) => {
      if (value === "true") {
        await db.deleteCategory(props.id);
      }
    };
    deleteModal.showModal(
      `Sure wanna delete “${props.title}” and all its tasks, projects & categories?`,
    );
  }
  function onEdit() {
    editModal.onClose = async (value) => {
      if (value.length > 0) {
        await db.categories.update(props.id, { title: value });
      }
    };
    editModal.showModal(props.title);
  }
  function onClick() {
    if (isSelectionStarted.value) {
      if (isSelected) {
        RemoveFromSelection("category", props.id);
      } else {
        AddToSelection("category", props.id);
      }
      return;
    } else {
      router.replace("/pwa/categories/details/" + props.id);
    }
  }
  return (
    <motion.article
      id={"c" + props.id}
      initial={{ opacity: 0, marginBottom: 0 }}
      animate={{ opacity: 1, marginBottom: "1rem" }}
      exit={{ opacity: 0, marginBottom: 0 }}
      className="relative mb-4"
      onClick={onClick}
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
        onContextMenu={ContextMenuHandler}
        onDragEnd={DragEndHandler}
        onDragTransitionEnd={DragTransitionEndHandler}
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
            {info.tasks.length > 0 &&
              info.tasks.length + " Task" + (info.tasks.length > 1 ? "s" : "")}
            {info.tasks.length > 0 && info.projects.length > 0 && " • "}
            {info.projects.length > 0 &&
              info.projects.length +
                " Project" +
                (info.projects.length > 1 ? "s" : "")}
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
