type GCEventNames = number | "restart" | "cancel" | "play" | "pause" | "finish";
export class GC<T> /* Generator Controller*/ {
  #isPaused: boolean = false;
  #resolvePause?: (value: unknown) => void;
  #rejectPause?: (reason?: unknown) => void;
  #gen: AsyncGenerator<unknown, T, unknown>;
  #genFn: () => AsyncGenerator<unknown, T, unknown>;
  #callbackStack: Map<GCEventNames, (value: GCEventNames) => void> = new Map();
  then: ((value: unknown) => void) | undefined = undefined;
  done: boolean = false;

  constructor(fn: () => AsyncGenerator<unknown, T, unknown>) {
    this.#genFn = fn;
    this.#gen = fn();
  }
  async run() {
    let value: unknown, done: boolean | undefined;
    do {
      const result = await this.#gen.next();
      if (typeof result.value === "number") this.callbackHandler(result.value);
      value = result.value ?? value;
      done = result.done;
      if (this.#isPaused) {
        await new Promise((resolve, reject) => {
          [this.#resolvePause, this.#rejectPause] = [resolve, reject];
        });
      }
    } while (!done);
    this.done = true;
    this.callbackHandler("finish");
    if (this.then) {
      return this.then(value);
    } else return value;
  }
  play() {
    if (this.#isPaused && this.#resolvePause) {
      this.#isPaused = false;
      this.#resolvePause(true);
    } else {
      this.run();
    }
    this.callbackHandler("play");
    return this;
  }
  pause() {
    if (this.#isPaused === true) return this;
    this.#isPaused = true;
    this.callbackHandler("pause");
    return this;
  }
  cancel() {
    this.#isPaused = true;
    if (this.#rejectPause) this.#rejectPause();
    this.callbackHandler("cancel");
  }
  restart() {
    this.#gen = this.#genFn();
    this.callbackHandler("restart");
  }
  when(nextValue: GCEventNames, cb: (value: GCEventNames) => void) {
    this.#callbackStack.set(nextValue, cb);
  }
  private callbackHandler(key: GCEventNames) {
    if (this.#callbackStack.has(key)) {
      const cbFn = this.#callbackStack.get(key)!;
      cbFn(key);
    }
  }
}

export function Tuturial(doc: Document, pointer: HTMLDivElement) {
  async function* goBack() {
    for (const modal of doc.getElementsByTagName("dialog")) {
      if (modal.hasAttribute("open")) {
        modal.close();
        await wait(300);
      }
    }
    if (doc.location){
      while (doc.location.pathname !== "/pwa") {
        const elm = yield* whenLoaded(
          () =>
            doc.querySelector("header button[name='back']") as HTMLButtonElement,
        );
        yield* goto(elm);
        yield* press(elm);
      }
    } else {
      console.log(doc.location)
    }
  }
  // function swipe(dir: "left" | "right") {
  //   const m = dir === "left" ? -1 : 1;
  //   const init: PointerEventInit = {
  //     cancelable: false,
  //     bubbles: true,
  //     pressure: 1,
  //     pointerId: 1,
  //     pointerType: "touch",
  //     isPrimary: true,
  //     composed: true,
  //   };
  //   const move = (x: number) => {
  //     const newInit: PointerEventInit = {
  //       ...init,
  //       movementX: x * m,
  //       clientX: x * m,
  //       screenX: x * m,
  //     };
  //     return newInit;
  //   };

  //   return async function* (elm: HTMLElement) {
  //     yield elm.dispatchEvent(new PointerEvent("pointerdown", init));
  //     for (let i = 0; i < 70; ++i) {
  //       yield await wait(3);
  //       yield elm.dispatchEvent(new PointerEvent("pointermove", move(i * 5)));
  //     }
  //     yield await wait(2);
  //     return elm.dispatchEvent(new PointerEvent("pointerup", move(70 * 5)));
  //   };
  // }
  function write(text: string) {
    return async function* (elm: HTMLInputElement) {
      yield elm.dispatchEvent(
        new FocusEvent("focus", { bubbles: true, cancelable: false }),
      );
      const n = text.length;
      for (let i = 1; i <= n; ++i) {
        yield await wait(100);
        const char = text.slice(0, i);
        yield (elm.value = char);
      }
      yield elm.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, cancelable: false }),
      );
      return elm.blur();
    };
  }
  async function* press(elm: HTMLElement) {
    const pointerInit: PointerEventInit = {
      pointerType: "touch",
      pressure: 1,
      isPrimary: true,
      bubbles: true,
      cancelable: true,
      pointerId: 1,
    };
    const mouseInit: MouseEventInit = {
      bubbles: true,
      cancelable: true,
    };

    yield elm.dispatchEvent(new PointerEvent("pointerdown", pointerInit));
    yield await wait(250);
    yield elm.dispatchEvent(new PointerEvent("pointerup", pointerInit));
    yield await wait(5);
    yield elm.dispatchEvent(new MouseEvent("click", mouseInit));

    return await wait(5);
  }
  async function* goto<E extends HTMLElement>(elm: E, modal: boolean = false) {
    const centerOf = function (rect: DOMRect) {
      return {
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
      };
    };
    const distance = function (s0: DOMRect, s1: DOMRect) {
      const cs0 = centerOf(s0),
        cs1 = centerOf(s1);
      return Math.sqrt((cs0.left - cs1.left) ** 2 + (cs0.top - cs1.top) ** 2);
    };

    if (modal) yield await wait(750);
    const pp = pointer.getBoundingClientRect(); // Pointer's position
    const ep = elm.getBoundingClientRect(); // Element's position
    const v = 3; // Pointer's velocity px/ms
    const ec = centerOf(ep);
    const left = ec.left - 4,
      top = ec.top - 4;
    yield await new Promise((resolve) => {
      pointer.animate([{ left: left + "px", top: top + "px" }], {
        duration: distance(pp, ep) / v,
        fill: "forwards",
        easing: "ease-out",
      }).onfinish = resolve;
    });
    yield await new Promise((resolve) => {
      pointer.animate(
        { transform: ["scale(1)", "scale(.8)", "scale(1)"] },
        { duration: 100 },
      ).onfinish = resolve;
    });
    if (pp.left === left && pp.top === top) return elm;
  }
  async function* whenLoaded<T>(param: () => T | null) {
    let itr = 0;
    let result = param();
    while ((result === null || result === undefined) && itr < 100) {
      yield await wait(200);
      result = param();
      ++itr;
    }
    if (result === null || result === undefined)
      throw new DOMException("Element was not found");
    else {
      if (result instanceof HTMLElement) result.scrollIntoView();
      return result;
    }
  }
  async function wait(dur: number) {
    await new Promise<unknown>((res) => setTimeout(res, dur));
  }
  async function* AddCategory() {
    yield* goBack();
    let elm = yield* whenLoaded(() => doc.getElementById("add-category"));
    yield 0;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(() => doc.getElementById("add-btn"));
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(() => doc.getElementById("add-category-btn"));
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc
          .getElementById("add-edit-category")!
          .getElementsByTagName("input")[0],
    );
    yield* goto(elm, true);
    yield 1;
    yield* write("Personal")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc
          .getElementById("add-edit-category")!
          .getElementsByTagName("button")[1],
    );
    yield* goto(elm);
    yield* press(elm);
    yield 2;
  }
  async function* AddProject() {
    yield* goBack();
    let elm = yield* whenLoaded(() => doc.getElementById("add-project"));
    yield 0;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="project"] input[name="title"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield 1;
    yield* write("Uglier2Don't App")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="project"] input[name="description"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield 2;
    yield* write("Ugly2don't app but uglier")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="project"] button[aria-label="calendar"]',
        ) as HTMLButtonElement,
    );
    yield 3;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          '#calendar button[aria-label="next week"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="project"] button[aria-label="clock"]',
        ) as HTMLButtonElement,
    );
    yield 4;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () => doc.querySelector('#clock input[name="hour"]') as HTMLInputElement,
    );
    yield* goto(elm, true);
    yield* write("11")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () => doc.querySelector('#clock input[name="min"]') as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("30")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          '#clock button[aria-label="confirm"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="project"] .menu[aria-label="priority"] .menu-button',
        ) as HTMLDivElement,
    );
    yield 5;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="project"] .menu[aria-label="priority"] .menu-item',
        ) as HTMLLIElement,
    );
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'header button[name="add-project"]',
        ) as HTMLButtonElement,
    );
    yield 6;
    yield* goto(elm);
    yield* press(elm);
  }
  async function* AddTask() {
    yield* goBack();
    let elm = yield* whenLoaded(() => doc.getElementById("add-task"));
    yield 0;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] input[name="title"]',
        ) as HTMLInputElement,
    );
    yield 1;
    yield* goto(elm);
    yield* write("Sneezing with open eyes")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] input[name="description"]',
        ) as HTMLInputElement,
    );
    yield 2;
    yield* goto(elm);
    yield* write("Proving scientists are wrong!")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] button[aria-label="calendar"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          '#calendar button[aria-label="tomorrow"]',
        ) as HTMLButtonElement,
    );
    yield 3;
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] button[aria-label="clock"]',
        ) as HTMLButtonElement,
    );
    yield 4;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () => doc.querySelector('#clock input[name="hour"]') as HTMLInputElement,
    );
    yield* goto(elm, true);
    yield* write("4")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () => doc.querySelector('#clock input[name="min"]') as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("20")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          '#clock button[aria-label="confirm"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] .menu[aria-label="priority"] .menu-button',
        ) as HTMLDivElement,
    );
    yield 5;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] .menu[aria-label="priority"] .menu-item:last-child',
        ) as HTMLLIElement,
    );
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] input[name="subtask-title"]',
        ) as HTMLInputElement,
    );
    yield 6;
    yield* goto(elm);
    yield* write("Buyin green leaves 🌿")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] button[name="add-subtask"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] input[name="subtask-title"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("Steaming the veggies. ♨️")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] button[name="add-subtask"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] input[name="subtask-title"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("Inhaling and forcing a sneeze 😮‍💨")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'form[name="task"] button[name="add-subtask"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector(
          'header button[name="verify-task"]',
        ) as HTMLButtonElement,
    );
    yield 7;
    yield* goto(elm);
    yield* press(elm);
    yield await wait(5000);
    elm = yield* whenLoaded(
      () =>
        doc.querySelector('header button[name="confirm"]') as HTMLButtonElement,
    );
    yield 8;
    yield* goto(elm);
    yield* press(elm);
  }
  return { AddCategory, AddProject, AddTask } as const;
}
