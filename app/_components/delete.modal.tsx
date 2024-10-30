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
      className="popup-modal p-4 bg-primary-700 text-white rounded-3xl"
      onClick={handleCancel}
    >
      <form method="dialog">
        <p className="pb-4">{modals.delete.message}</p>
        <div className="flex gap-2">
          <Button
            value="false"
            className="btn-md w-full border-2 border-primary-800 justify-center tap-primary-800"
          >
            nope
          </Button>
          <Button
            value="true"
            className="btn-md w-full justify-center bg-primary-800 tap-primary-900"
          >
            yup!
          </Button>
        </div>
      </form>
    </dialog>
  );
}
