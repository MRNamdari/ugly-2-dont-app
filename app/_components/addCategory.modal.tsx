"use client";

import {
  createContext,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import TextInput from "./text-input";
import Button from "./button";

export const AddCategoryContext = createContext<{
  showModal: () => void;
  close: () => void;
  onClose: (e: Event) => any;
}>({
  showModal() {},
  close() {},
  onClose() {},
});

export default function AddCategoryModal(props: { children: React.ReactNode }) {
  const [value, setValue] = useState("");
  const onClose = useRef<{ cb: (e: Event) => any }>({ cb() {} });
  const ref = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.onclose = (ev) => {
      if (form.current) form.current.reset();
      if (onClose.current) onClose.current.cb(ev);
    };
  }, []);

  function showModal() {
    startTransition(() => {
      const dialog = ref.current;
      if (dialog) dialog.showModal();
    });
  }
  function close() {
    startTransition(() => {
      const dialog = ref.current;
      if (dialog) dialog.close();
      if (form.current) form.current.reset();
    });
  }

  function ClickHandler(e: MouseEvent<HTMLDialogElement>) {
    const dialog = ref.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) close();
  }

  return (
    <AddCategoryContext.Provider
      value={{
        showModal,
        close,
        set onClose(callback: (ev: Event) => {}) {
          onClose.current.cb = callback;
        },
      }}
    >
      <dialog
        ref={ref}
        onClick={ClickHandler}
        className="dropdown-modal relative mt-0 w-full min-w-0 max-w-screen-sm rounded-3xl rounded-t-none bg-primary-700 pb-8 text-white after:absolute after:bottom-4 after:left-1/2 after:block after:h-1 after:w-1/4 after:-translate-x-1/2 after:rounded-sm after:bg-primary-800"
      >
        <h3 className="w-full px-4 py-6 text-center text-lg">New Category</h3>
        <form ref={form} method="dialog" className="flex flex-col gap-4 px-4">
          <TextInput className="group text-input-md bg-primary-800 *:transition-colors">
            <input
              type="text"
              name="title"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Category Name"
              className="placeholder:text-inherit placeholder:transition-colors group-focus-within:placeholder:text-primary-400"
            />
          </TextInput>
          <div className="flex gap-4">
            <Button
              className="tap-primary-600 btn-md justify-center border-2 border-primary-800"
              value=""
            >
              Cancel
            </Button>
            <Button
              value={value}
              className="tap-primary-600 btn-md justify-center bg-primary-800"
            >
              Add
            </Button>
          </div>
        </form>
      </dialog>
      {props.children}
    </AddCategoryContext.Provider>
  );
}
