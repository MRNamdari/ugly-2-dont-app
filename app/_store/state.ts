import { signal, effect } from "@preact/signals-react";

export const modals = {
  calendar: signal<Date>(),
  clock: signal<Date>(),
};

effect(() => {
  console.log(modals.clock.value);
});
