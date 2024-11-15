import { signal, computed, Signal } from "@preact/signals-react";
import {
  categories,
  ICategory,
  IProject,
  ISubTask,
  ITask,
  projects,
  tasks,
} from "./db";

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
  moving: {
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

export const isMovingStarted = computed(() => {
  const keys = Object.keys(store.moving) as Feature[];
  return keys.map((f) => store.moving[f].value.length > 0).some((b) => b);
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
  if (!isMovingStarted.value) {
    const selMgr = store.selection[feature];
    selMgr.value = selMgr.value.concat(fid);
  }
}
export function IsSelected(feature: Feature, fid: number) {
  const selMgr = store.selection[feature];
  return selMgr.value.includes(fid);
}
/**
 * @todo empty FormData when window is closed
 */
export const TaskFormDataSignal = signal<Partial<ITask>>({});
export const ProjectFormDataSignal = signal<Partial<IProject>>({});
