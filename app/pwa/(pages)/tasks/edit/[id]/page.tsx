"use client";
import { store, TaskToFormData } from "@/app/_store/state";
import AddTaskPage from "../../add/page";
import { ITaskFormData } from "@/app/_store/data";

export default function EditTaskPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: ITaskFormData;
}) {
  const task =
    Object.keys(searchParams).length > 0
      ? searchParams
      : TaskToFormData(store.tasks.value.find((t) => t.id == params.id));
  if (task) return <AddTaskPage params={params} searchParams={task} />;
  return <p>Task was not found</p>;
}
