"use client";
import Button from "./button";
import {
  createContext,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePreviousValue } from "./layout-transition";

export const DeleteContext = createContext({
  showModal(msg: string) {},
  close() {},
  onClose(value: string) {},
});

export default function DeleteModal(props: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string>();
  const pre = usePreviousValue(msg);
  const ref = useRef<HTMLDialogElement>(null);
  const onClose = useRef<{ cb: (value: string) => void }>({ cb() {} });
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.onclose = () => {
      onClose.current.cb(dialog.returnValue);
    };
  }, []);
  function showModal(msg: string) {
    startTransition(() => {
      setMsg(msg);
    });
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
  }
  function close() {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.close();
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
  return (
    <DeleteContext.Provider
      value={{
        showModal,
        close,
        set onClose(cb: (value: string) => void) {
          onClose.current.cb = cb;
        },
      }}
    >
      <dialog
        id="delete"
        ref={ref}
        className="popup-modal rounded-3xl bg-primary-700 p-4 text-white"
        onClick={handleCancel}
      >
        <form method="dialog">
          {!isPending && <p className="pb-4">{msg}</p>}
          <div className="flex gap-2">
            <Button
              name="cancel"
              value="false"
              className="tap-primary-800 btn-md w-full justify-center border-2 border-primary-800"
            >
              nope
            </Button>
            <Button
              name="confirm"
              value="true"
              className="tap-primary-900 btn-md w-full justify-center bg-primary-800"
            >
              yup!
            </Button>
          </div>
        </form>
      </dialog>
      {props.children}
    </DeleteContext.Provider>
  );
}
