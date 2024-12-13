"use client";

import AddProjectPage from "../../add/page";
import { IProject } from "@/app/_store/db";

export const runtime = "edge";

export default function EditProjectPage({
  params,
}: {
  params: { id: `${IProject["id"]}` };
}) {
  return <AddProjectPage params={params} />;
}
