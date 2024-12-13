"use client";
import Button from "./button";
import IconButton from "./icon-button";
import {
  createContext,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

type AddButtons = {
  category?: string | MouseEventHandler<HTMLButtonElement>;
  project?: string | MouseEventHandler<HTMLButtonElement>;
  task?: string | MouseEventHandler<HTMLButtonElement>;
};
type AddContextValue = {
  showModal: (btn: AddButtons) => void;
  close: () => void;
  onClose: () => void;
};
export const AddContext = createContext<AddContextValue>({
  showModal() {},
  close() {},
  onClose() {},
});
export default function AddModal(props: { children: React.ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const constant = useRef<{ cb: () => void }>({ cb: () => {} });
  const startTransition = useTransition()[1];
  const [buttons, setButtons] = useState<AddButtons>({});

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.onclose = constant.current.cb;
  }, []);

  function showModal(btn: AddButtons) {
    const dialog = ref.current;
    if (!dialog) return;
    startTransition(() => {
      setButtons(btn);
      dialog.showModal();
    });
  }

  function close() {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.close("");
  }

  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    const dialog = ref.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) dialog.close();
  }
  function CategoryClickHandler(e: MouseEvent<HTMLButtonElement>) {
    ref.current?.close();
    if (typeof buttons.category === "string") {
      router.push(buttons.category);
    } else if (typeof buttons.category === "function") {
      buttons.category(e);
    }
  }

  function ProjectClickHandler(e: MouseEvent<HTMLButtonElement>) {
    ref.current?.close();
    if (typeof buttons.project === "string") {
      router.push(buttons.project);
    } else if (typeof buttons.project === "function") {
      buttons.project(e);
    }
  }

  function TaskClickHandler(e: MouseEvent<HTMLButtonElement>) {
    ref.current?.close();
    if (typeof buttons.task === "string") {
      router.push(buttons.task);
    } else if (typeof buttons.task === "function") {
      buttons.task(e);
    }
  }

  return (
    <AddContext.Provider
      value={{
        showModal,
        close,
        set onClose(cb: () => void) {
          constant.current.cb = cb;
        },
      }}
    >
      <dialog
        ref={ref}
        id="add"
        className="popup-modal absolute mb-24 ml-auto mr-6 mt-auto origin-bottom-right bg-transparent text-primary-800 outline-none"
        onClick={handleCancel}
      >
        {buttons.category && (
          <div className="flex justify-end gap-2 py-1">
            <Button
              id="add-category-btn"
              className="tap-zinc-200 btn-md w-fit bg-zinc-50 font-medium"
              onClick={CategoryClickHandler}
            >
              Category
            </Button>
            <IconButton
              icon="FolderPlus"
              className="tap-zinc-200 ico-md bg-zinc-50"
              onClick={CategoryClickHandler}
            />
          </div>
        )}
        {buttons.project && (
          <div className="flex justify-end gap-2 py-1">
            <Button
              id="add-project-btn"
              className="tap-zinc-200 btn-md w-fit bg-zinc-50 font-medium"
              onClick={ProjectClickHandler}
            >
              Project
            </Button>
            <IconButton
              icon="Crosshair"
              className="tap-zinc-200 ico-md bg-zinc-50"
              onClick={ProjectClickHandler}
            />
          </div>
        )}
        {buttons.task && (
          <div className="flex justify-end gap-2 py-1">
            <Button
              id="add-task-btn"
              className="tap-zinc-200 btn-md w-fit bg-zinc-50 font-medium"
              onClick={TaskClickHandler}
            >
              Task
            </Button>
            <IconButton
              icon="CheckSquare"
              className="tap-zinc-200 ico-md bg-zinc-50"
              onClick={TaskClickHandler}
            />
          </div>
        )}
      </dialog>
      {props.children}
    </AddContext.Provider>
  );
}
