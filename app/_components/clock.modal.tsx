import { useState, MouseEvent, useRef } from "react";
import { modals } from "../_store/state";
import Icon from "./icon";
import IconButton from "./icon-button";
import { num2str } from "./util";

const pickedTime = modals.clock.signal;

export default function Clock() {
  // hooks
  const [time, setTime] = useState<Date>(pickedTime.value ?? new Date());
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
      className="min-w-0 w-full max-w-screen-sm bg-primary-700 pb-8 mt-0 rounded-3xl rounded-t-none relative after:block after:absolute after:w-1/4 after:h-1 after:bg-primary-800 after:rounded-sm after:left-1/2 after:-translate-x-1/2 after:bottom-4"
    >
      <div className="flex items-center w-full justify-between px-4 py-6 text-white">
        <IconButton
          icon="X"
          className="ico-md bg-primary-800 tap-primary-900"
          onClick={handleClose}
          aria-label="Press to close"
        />
        <h3 className="text-lg">Pick A Time</h3>
        <IconButton
          icon="Check"
          className="ico-md bg-primary-800 tap-primary-900"
          onClick={handleSubmit}
          aria-label="Press to confirm"
        />
      </div>
      <form ref={form} method="dialog" className="flex gap-2 justify-center">
        <div className="flex text-white justify-center items-center text-3xl h-[fill-available] bg-primary-800 rounded-full gap-2 p-2">
          <input
            className="h-full text-inherit text-3xl font-medium bg-primary-700 text-center  rounded-r-md rounded-[4rem]"
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
            className="h-full text-inherit text-3xl font-medium bg-primary-700 text-center  rounded-l-md rounded-[4rem]"
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
        <div className=" rounded-full bg-primary-800 relative p-2">
          <input
            type="checkbox"
            name="ampm"
            className="absolute w-full h-full inset-0 appearance-none peer z-10 cursor-pointer rounded-full"
            defaultChecked={time.getHours() > 12}
          />

          <Icon
            label="Sunrise"
            className="text-warning-400 bg-warning-50 p-1 transition-all rounded-full size-8 peer-checked:opacity-0 peer-checked:translate-y-full"
          />
          <Icon
            label="Sunset"
            className="text-error-400 bg-error-50 p-1 transition-all rounded-full size-8 opacity-0 -translate-y-full peer-checked:opacity-100 peer-checked:-translate-y-0"
          />
        </div>
      </form>
    </dialog>
  );
}
