import { modals } from "../_store/state";
import Button from "./button";
import { MouseEvent } from "react";
export default function DeleteModal() {
  function handleCancel(e: MouseEvent<HTMLDialogElement>) {
    const modal = e.target as HTMLDialogElement;
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) modal.close();
  }
  return (
    <dialog
      id="delete"
      className="popup-modal rounded-3xl bg-primary-700 p-4 text-white"
      onClick={handleCancel}
    >
      <form method="dialog">
        <p className="pb-4">{modals.delete.message}</p>
        <div className="flex gap-2">
          <Button
            value="false"
            className="tap-primary-800 btn-md w-full justify-center border-2 border-primary-800"
          >
            nope
          </Button>
          <Button
            value="true"
            className="tap-primary-900 btn-md w-full justify-center bg-primary-800"
          >
            yup!
          </Button>
        </div>
      </form>
    </dialog>
  );
}
