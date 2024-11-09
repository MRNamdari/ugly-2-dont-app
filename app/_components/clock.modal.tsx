"use client";
import {
  useState,
  MouseEvent,
  useRef,
  createContext,
  useEffect,
  ChangeEvent,
  FocusEvent,
} from "react";
import { num2str } from "./util";

import Icon from "./icon";
import IconButton from "./icon-button";

export const ClockContext = createContext({
  showModal(time?: string) {},
  close() {},
  onClose(time?: string) {},
});

export default function ClockModal(props: { children: React.ReactNode }) {
  // hooks
  const [time, setTime] = useState<Date>(new Date());
  const value = time.toTimeString().replace(/\s.*/, "");

  const ref = useRef<HTMLDialogElement>(null);
  const hour = useRef<HTMLInputElement>(null);
  const min = useRef<HTMLInputElement>(null);
  const ampm = useRef<HTMLInputElement>(null);
  const constant = useRef({ cb: (time?: string) => {}, time: "" });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.onclose = () => {
      constant.current.cb(dialog.returnValue);
    };
  }, []);

  function showModal(time?: string) {
    if (time) {
      constant.current.time = time;
      setTime(new Date("0 " + time));
    }
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
  }

  function close(e?: MouseEvent<HTMLButtonElement>) {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.close(dialog.returnValue);
  }

  function localTimeToDate() {
    if (!hour.current || !min.current || !ampm.current) return;
    const ap = ampm.current.checked;
    return new Date(
      "0 " +
        hour.current.value +
        ":" +
        min.current.value +
        " " +
        (ap ? "PM" : "AM"),
    );
  }

  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) close();
  }

  function handleChange(e: ChangeEvent) {
    const d = localTimeToDate();
    d && setTime(d);
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    const i = e.target;
    i.value = num2str(parseInt(i.value));
  }

  return (
    <ClockContext.Provider
      value={{
        showModal,
        close,
        set onClose(cb: () => any) {
          constant.current.cb = cb;
        },
      }}
    >
      <dialog
        ref={ref}
        id="clock"
        onClick={handleCancel}
        className="dropdown-modal relative mt-0 w-full min-w-0 max-w-screen-sm rounded-3xl rounded-t-none bg-primary-700 pb-8 after:absolute after:bottom-4 after:left-1/2 after:block after:h-1 after:w-1/4 after:-translate-x-1/2 after:rounded-sm after:bg-primary-800"
      >
        <div className="flex w-full items-center justify-between px-4 py-6 text-white">
          <IconButton
            icon="X"
            className="tap-primary-900 ico-md bg-primary-800"
            onClick={close}
            aria-label="Press to close"
            value=""
          />
          <h3 className="text-lg">Pick A Time</h3>
          <IconButton
            icon="Check"
            className="tap-primary-900 ico-md bg-primary-800"
            value={value}
            form="clock-form"
            aria-label="Press to confirm"
          />
        </div>
        <form
          id="clock-form"
          method="dialog"
          className="flex justify-center gap-2"
        >
          <div className="flex h-[fill-available] items-center justify-center gap-2 rounded-full bg-primary-800 p-2 text-3xl text-white">
            <input
              ref={hour}
              className="h-full rounded-[4rem] rounded-r-md bg-primary-700 text-center text-3xl font-medium text-inherit"
              type="number"
              size={2}
              maxLength={2}
              max={12}
              min={1}
              inputMode="numeric"
              defaultValue={
                time.getHours() > 12
                  ? num2str(time.getHours() - 12)
                  : num2str(time.getHours())
              }
              onBlur={handleBlur}
              onChange={handleChange}
            />
            :
            <input
              ref={min}
              className="h-full rounded-[4rem] rounded-l-md bg-primary-700 text-center text-3xl font-medium text-inherit"
              type="number"
              size={2}
              maxLength={2}
              max={59}
              min={0}
              inputMode="numeric"
              onBlur={handleBlur}
              onChange={handleChange}
              defaultValue={num2str(time.getMinutes())}
            />
          </div>
          <div className="relative rounded-full bg-primary-800 p-2">
            <input
              ref={ampm}
              type="checkbox"
              className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded-full"
              defaultChecked={time.getHours() > 12}
              onChange={handleChange}
            />

            <Icon
              label="Sunrise"
              className="size-8 rounded-full bg-warning-50 p-1 text-warning-400 transition-all peer-checked:translate-y-full peer-checked:opacity-0"
            />
            <Icon
              label="Sunset"
              className="size-8 -translate-y-full rounded-full bg-error-50 p-1 text-error-400 opacity-0 transition-all peer-checked:-translate-y-0 peer-checked:opacity-100"
            />
          </div>
        </form>
      </dialog>
      {props.children}
    </ClockContext.Provider>
  );
}
