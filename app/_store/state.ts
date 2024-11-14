import { signal, effect, computed, Signal } from "@preact/signals-react";
import {
  categories,
  ICategory,
  IProject,
  ISubTask,
  ITask,
  projects,
  tasks,
} from "./db";
import { date2display, timeToLocalTime, wildCard } from "../_components/util";

export type SignalValue<T> = T extends Signal<infer U> ? U : never;

export const store = {
  view: {
    category: signal<number[]>([]),
    project: signal<number[]>([]),
    task: signal<number[]>([]),
  },
  selection: {
    category: signal<number[]>([]),
    project: signal<number[]>([]),
    task: signal<number[]>([]),
  },
};

type Feature = keyof typeof store.selection;

export const isSelectionStarted = computed(() => {
  const keys = Object.keys(store.selection) as Feature[];
  return keys.map((f) => store.selection[f].value.length > 0).some((b) => b);
});

export function encodeURL(struct: any) {
  const url = new URLSearchParams(struct);
  return "?" + url;
}

export function RemoveFromSelection(feature: Feature, fid: number) {
  let selMgr = store.selection[feature];
  selMgr.value = selMgr.value.filter((id) => fid !== id);
}
export function AddToSelection(feature: Feature, fid: number) {
  const selMgr = store.selection[feature];
  selMgr.value = selMgr.value.concat(fid);
}
export function IsSelected(feature: Feature, fid: number) {
  const selMgr = store.selection[feature];
  return selMgr.value.includes(fid);
}

export const TaskFormDataSignal = signal<Partial<ITask>>({});
