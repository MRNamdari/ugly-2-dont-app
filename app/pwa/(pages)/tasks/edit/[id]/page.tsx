"use client";
import { ITask } from "@/app/_store/db";
import AddTaskPage from "../../add/page";

export const runtime = "edge";

export default function EditTaskPage({
  params,
}: {
  params: { id: `${ITask["id"]}` };
}) {
  return <AddTaskPage params={params} />;
}
