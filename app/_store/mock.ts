export type GCEventNames =
  | number
  | "restart"
  | "cancel"
  | "play"
  | "pause"
  | "finish"
  | "error";

/**
 * Generator Controller: plays an async generator step by step with
 * play / pause / restart / cancel. `yield <number>` inside the generator marks
 * a "step" and fires the listener registered with `when(<number>, cb)`.
 */
export class GC<T> {
  #isPaused = false;
  #isRunning = false;
  #resumePause?: () => void;
  // Incremented on every start/cancel so a superseded run loop stops itself.
  #token = 0;
  #gen: AsyncGenerator<unknown, T, unknown>;
  #genFn: () => AsyncGenerator<unknown, T, unknown>;
  #listeners = new Map<GCEventNames, (value: GCEventNames) => void>();
  done = false;

  constructor(fn: () => AsyncGenerator<unknown, T, unknown>) {
    this.#genFn = fn;
    this.#gen = fn();
  }

  async #run() {
    const token = ++this.#token;
    this.#isRunning = true;
    this.#isPaused = false;
    try {
      while (token === this.#token) {
        const result = await this.#gen.next();
        if (token !== this.#token) return; // cancelled / restarted meanwhile
        if (typeof result.value === "number") this.#emit(result.value);
        if (result.done) {
          this.done = true;
          this.#emit("finish");
          return;
        }
        if (this.#isPaused) {
          await new Promise<void>((resolve) => (this.#resumePause = resolve));
          this.#resumePause = undefined;
        }
      }
    } catch (error) {
      if (token !== this.#token) return;
      // A failed generator is finished for good; get a fresh one so that
      // pressing play again starts over instead of doing nothing.
      console.error("Tutorial stopped:", error);
      this.#gen = this.#genFn();
      this.#emit("error");
    } finally {
      if (token === this.#token) this.#isRunning = false;
    }
  }

  play() {
    if (this.done) return this;
    if (this.#isPaused && this.#resumePause) {
      this.#isPaused = false;
      this.#resumePause();
    } else if (!this.#isRunning) {
      void this.#run();
    } else {
      this.#isPaused = false;
    }
    this.#emit("play");
    return this;
  }

  pause() {
    if (this.#isPaused || !this.#isRunning) return this;
    this.#isPaused = true;
    this.#emit("pause");
    return this;
  }

  /** Stops the current run for good. A cancelled controller can be restarted. */
  cancel() {
    this.#token++;
    this.#isRunning = false;
    this.#isPaused = false;
    this.#resumePause?.();
    this.#resumePause = undefined;
    this.#emit("cancel");
  }

  /** Stops the current run (if any) and rewinds to the first step. */
  restart() {
    this.#token++; // abandon a running loop, otherwise two would run at once
    this.#isRunning = false;
    this.#isPaused = false;
    this.#resumePause?.();
    this.#resumePause = undefined;
    this.#gen = this.#genFn();
    this.done = false;
    this.#emit("restart");
  }

  when(event: GCEventNames, cb: (value: GCEventNames) => void) {
    this.#listeners.set(event, cb);
  }

  #emit(key: GCEventNames) {
    this.#listeners.get(key)?.(key);
  }
}

export function Tuturial(iframe: HTMLIFrameElement, pointer: HTMLDivElement) {
  // The iframe's document is replaced on every navigation that is not a
  // client-side route change, so always resolve it at the moment of use instead
  // of holding on to one that may already be detached.
  const doc = () => iframe.contentDocument as Document;
  const win = () => iframe.contentWindow as Window & typeof globalThis;
  // Events/elements of the iframe belong to its own JS realm.
  // `instanceof HTMLElement` / `new PointerEvent` of this window don't match.
  const view = (elm: Element) =>
    elm.ownerDocument.defaultView as Window & typeof globalThis;
  const isElement = (value: unknown): value is HTMLElement =>
    !!value && typeof (value as Element).getBoundingClientRect === "function";

  async function* goBack() {
    for (const modal of Array.from(doc().getElementsByTagName("dialog"))) {
      if (modal.hasAttribute("open")) {
        modal.close();
        await wait(300);
      }
    }
    for (let hops = 0; hops < 10; ++hops) {
      const path = win().location.pathname.replace(/\/+$/, "");
      if (path === "/pwa") break;
      const elm = yield* whenLoaded(
        () =>
          doc().querySelector("header button[name='back']") as HTMLButtonElement,
      );
      yield* goto(elm);
      yield* press(elm);
      yield await wait(400); // let the route change settle
    }
  }

  function write(text: string) {
    return async function* (elm: HTMLInputElement) {
      const w = view(elm);
      // React listens to focusin/focusout (onFocus/onBlur).
      yield elm.dispatchEvent(new w.FocusEvent("focus"));
      yield elm.dispatchEvent(new w.FocusEvent("focusin", { bubbles: true }));
      // Assign through the native setter and fire `input`, otherwise React's
      // value tracking swallows the change and `onChange` never runs.
      const setValue = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(elm),
        "value",
      )?.set;
      for (let i = 1; i <= text.length; ++i) {
        yield await wait(100);
        const char = text.slice(0, i);
        if (setValue) setValue.call(elm, char);
        else elm.value = char;
        yield elm.dispatchEvent(new w.Event("input", { bubbles: true }));
      }
      yield elm.dispatchEvent(new w.Event("change", { bubbles: true }));
      yield elm.dispatchEvent(new w.FocusEvent("focusout", { bubbles: true }));
      return elm.blur();
    };
  }

  async function* press(elm: HTMLElement) {
    const w = view(elm);
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

    yield elm.dispatchEvent(new w.PointerEvent("pointerdown", pointerInit));
    yield await wait(250);
    yield elm.dispatchEvent(new w.PointerEvent("pointerup", pointerInit));
    yield await wait(5);
    yield elm.dispatchEvent(new w.MouseEvent("click", mouseInit));

    return await wait(5);
  }

  async function* goto<E extends HTMLElement>(elm: E, modal: boolean = false) {
    if (modal) yield await wait(750);
    // Element rects are relative to the iframe's viewport, the pointer lives in
    // the parent page, so translate between the two coordinate systems.
    const frame = iframe.getBoundingClientRect();
    const origin = (pointer.offsetParent ?? document.body).getBoundingClientRect();
    const target = elm.getBoundingClientRect();
    const cx = frame.left + target.left + target.width / 2; // viewport coords
    const cy = frame.top + target.top + target.height / 2;
    const from = pointer.getBoundingClientRect();
    const distance = Math.hypot(
      from.left + from.width / 2 - cx,
      from.top + from.height / 2 - cy,
    );
    const v = 3; // Pointer's velocity px/ms
    const left = cx - origin.left - pointer.offsetWidth / 2;
    const top = cy - origin.top - pointer.offsetHeight / 2;
    const move = pointer.animate([{ left: left + "px", top: top + "px" }], {
      duration: distance / v,
      fill: "forwards",
      easing: "ease-out",
    });
    await move.finished.catch(() => undefined);
    try {
      move.commitStyles(); // keep the position without piling up animations
      move.cancel();
    } catch {}
    yield undefined;
    const tap = pointer.animate(
      { transform: ["scale(1)", "scale(.8)", "scale(1)"] },
      { duration: 100 },
    );
    await tap.finished.catch(() => undefined);
    return elm;
  }

  /** Scrolls only inside the iframe (never the page that embeds it). */
  function reveal(elm: HTMLElement) {
    const w = view(elm);
    const r = elm.getBoundingClientRect();
    for (let p = elm.parentElement; p; p = p.parentElement) {
      const overflow = w.getComputedStyle(p).overflowY;
      if (
        (overflow === "auto" || overflow === "scroll") &&
        p.scrollHeight > p.clientHeight
      ) {
        const pr = p.getBoundingClientRect();
        if (r.top < pr.top || r.bottom > pr.bottom)
          p.scrollTop += r.top + r.height / 2 - (pr.top + pr.height / 2);
      }
    }
    if (r.top < 0 || r.bottom > w.innerHeight)
      w.scrollBy(0, r.top + r.height / 2 - w.innerHeight / 2);
  }

  async function* whenLoaded<T>(param: () => T | null | undefined) {
    let itr = 0;
    const attempt = () => {
      try {
        return param();
      } catch {
        return null; // e.g. the document is mid-navigation
      }
    };
    let result = attempt();
    while ((result === null || result === undefined) && itr < 100) {
      yield await wait(200);
      result = attempt();
      ++itr;
    }
    if (result === null || result === undefined)
      throw new DOMException("Element was not found");
    if (isElement(result)) reveal(result);
    return result;
  }

  function wait(dur: number) {
    return new Promise<void>((res) => setTimeout(res, dur));
  }
  async function* AddCategory() {
    yield* goBack();
    let elm = yield* whenLoaded(() => doc().getElementById("add-category"));
    yield 0;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(() => doc().getElementById("add-btn"));
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(() => doc().getElementById("add-category-btn"));
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc()
          .getElementById("add-edit-category")!
          .getElementsByTagName("input")[0],
    );
    yield* goto(elm, true);
    yield 1;
    yield* write("Personal")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc()
          .getElementById("add-edit-category")!
          .getElementsByTagName("button")[1],
    );
    yield* goto(elm);
    yield* press(elm);
    yield 2;
  }
  async function* AddProject() {
    yield* goBack();
    let elm = yield* whenLoaded(() => doc().getElementById("add-project"));
    yield 0;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="project"] input[name="title"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield 1;
    yield* write("Uglier2Don't App")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="project"] input[name="description"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield 2;
    yield* write("Ugly2don't app but uglier")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="project"] button[aria-label="calendar"]',
        ) as HTMLButtonElement,
    );
    yield 3;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          '#calendar button[aria-label="next week"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="project"] button[aria-label="clock"]',
        ) as HTMLButtonElement,
    );
    yield 4;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () => doc().querySelector('#clock input[name="hour"]') as HTMLInputElement,
    );
    yield* goto(elm, true);
    yield* write("11")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () => doc().querySelector('#clock input[name="min"]') as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("30")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          '#clock button[aria-label="confirm"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="project"] .menu[aria-label="priority"] .menu-button',
        ) as HTMLDivElement,
    );
    yield 5;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="project"] .menu[aria-label="priority"] .menu-item',
        ) as HTMLLIElement,
    );
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'header button[name="add-project"]',
        ) as HTMLButtonElement,
    );
    yield 6;
    yield* goto(elm);
    yield* press(elm);
  }
  async function* AddTask() {
    yield* goBack();
    let elm = yield* whenLoaded(() => doc().getElementById("add-task"));
    yield 0;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] input[name="title"]',
        ) as HTMLInputElement,
    );
    yield 1;
    yield* goto(elm);
    yield* write("Sneezing with open eyes")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] input[name="description"]',
        ) as HTMLInputElement,
    );
    yield 2;
    yield* goto(elm);
    yield* write("Proving scientists are wrong!")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] button[aria-label="calendar"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          '#calendar button[aria-label="tomorrow"]',
        ) as HTMLButtonElement,
    );
    yield 3;
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] button[aria-label="clock"]',
        ) as HTMLButtonElement,
    );
    yield 4;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () => doc().querySelector('#clock input[name="hour"]') as HTMLInputElement,
    );
    yield* goto(elm, true);
    yield* write("4")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () => doc().querySelector('#clock input[name="min"]') as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("20")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          '#clock button[aria-label="confirm"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] .menu[aria-label="priority"] .menu-button',
        ) as HTMLDivElement,
    );
    yield 5;
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] .menu[aria-label="priority"] .menu-item:last-child',
        ) as HTMLLIElement,
    );
    yield* goto(elm, true);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] input[name="subtask-title"]',
        ) as HTMLInputElement,
    );
    yield 6;
    yield* goto(elm);
    yield* write("Buyin green leaves 🌿")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] button[name="add-subtask"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] input[name="subtask-title"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("Steaming the veggies. ♨️")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] button[name="add-subtask"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] input[name="subtask-title"]',
        ) as HTMLInputElement,
    );
    yield* goto(elm);
    yield* write("Inhaling and forcing a sneeze 😮‍💨")(elm as HTMLInputElement);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'form[name="task"] button[name="add-subtask"]',
        ) as HTMLButtonElement,
    );
    yield* goto(elm);
    yield* press(elm);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector(
          'header button[name="verify-task"]',
        ) as HTMLButtonElement,
    );
    yield 7;
    yield* goto(elm);
    yield* press(elm);
    yield await wait(5000);
    elm = yield* whenLoaded(
      () =>
        doc().querySelector('header button[name="confirm"]') as HTMLButtonElement,
    );
    yield 8;
    yield* goto(elm);
    yield* press(elm);
  }
  return { AddCategory, AddProject, AddTask } as const;
}
