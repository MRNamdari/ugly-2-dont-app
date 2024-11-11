"use client";
import AddTaskPage from "../../add/page";

export default function EditTaskPage({ params }: { params: { id: string } }) {
  return <AddTaskPage params={{ id: parseInt(params.id) }} />;
}
