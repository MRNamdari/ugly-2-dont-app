import { signal, effect } from "@preact/signals-react";

export const modals = {
  calendar: signal<Date>(),
};

// effect(() => {
//   console.log(modals.calendar.value);
// });
