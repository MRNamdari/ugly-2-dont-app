"use client";
import { ProjectToFormData, store } from "@/app/_store/state";
import AddProjectPage from "../../add/page";
import { IProjectFormData } from "@/app/_store/data";

export default function EditProjectPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: IProjectFormData;
}) {
  const project =
    Object.keys(searchParams).length > 0
      ? searchParams
      : ProjectToFormData(store.projects.value.find((p) => p.id == params.id));
  if (project) return <AddProjectPage params={params} searchParams={project} />;
  return <p>Project was not found</p>;
}
