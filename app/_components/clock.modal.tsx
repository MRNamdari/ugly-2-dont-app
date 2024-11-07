"use client";
import { useState, MouseEvent, useRef } from "react";
import { useSignalEffect } from "@preact/signals-react";
import { modals } from "../_store/state";

import { num2str } from "./util";

import Icon from "./icon";
import IconButton from "./icon-button";

const pickedTime = modals.clock.signal;

export default function Clock() {
  // hooks
  const [time, setTime] = useState<Date>(new Date());
  useSignalEffect(() => {
    if (pickedTime.value) setTime(pickedTime.value);
  });
  const ref = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!form.current) return;
    const formData = new FormData(form.current);
    const h = parseInt(formData.get("hour")!.toString()),
      m = parseInt(formData.get("minute")!.toString()),
      ampm = formData.get("ampm") == "on";
    const date = new Date();
    date.setHours(ampm ? (h < 12 ? h + 12 : h) : h < 12 ? h : 0, m, 0, 0);
    pickedTime.value = date;
    setTime(date);
    handleClose();
  }

  function handleClose() {
    if (!ref.current) return;
    ref.current.close();
    form.current?.reset();
  }

  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) handleClose();
  }

  return (
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
          onClick={handleClose}
          aria-label="Press to close"
        />
        <h3 className="text-lg">Pick A Time</h3>
        <IconButton
          icon="Check"
          className="tap-primary-900 ico-md bg-primary-800"
          onClick={handleSubmit}
          aria-label="Press to confirm"
        />
      </div>
      <form ref={form} method="dialog" className="flex justify-center gap-2">
        <div className="flex h-[fill-available] items-center justify-center gap-2 rounded-full bg-primary-800 p-2 text-3xl text-white">
          <input
            className="h-full rounded-[4rem] rounded-r-md bg-primary-700 text-center text-3xl font-medium text-inherit"
            name="hour"
            type="number"
            size={2}
            maxLength={2}
            max={12}
            min={1}
            inputMode="numeric"
            defaultValue={
              time.getHours() >= 12
                ? num2str(time.getHours() - 12)
                : num2str(time.getHours())
            }
            onBlur={(e) => {
              const i = e.target as HTMLInputElement;
              i.value = num2str(parseInt(i.value));
            }}
          />
          :
          <input
            name="minute"
            className="h-full rounded-[4rem] rounded-l-md bg-primary-700 text-center text-3xl font-medium text-inherit"
            type="number"
            size={2}
            maxLength={2}
            max={59}
            min={0}
            inputMode="numeric"
            onBlur={(e) => {
              const i = e.target as HTMLInputElement;
              i.value = num2str(parseInt(i.value));
            }}
            defaultValue={num2str(time.getMinutes())}
          />
        </div>
        <div className="relative rounded-full bg-primary-800 p-2">
          <input
            type="checkbox"
            name="ampm"
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded-full"
            defaultChecked={time.getHours() > 12}
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
  );
}
