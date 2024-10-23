import { signal, effect } from "@preact/signals-react";
import { categories, projects, tasks } from "./data";

export const modals = {
  calendar: signal<Date>(),
  clock: signal<Date>(),
};

export const store = signal({ tasks, projects, categories });

effect(() => {
  console.log(modals.clock.value);
});
