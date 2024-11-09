import { Dispatch, useState, useEffect, useRef, MutableRefObject } from "react";

// Style Configuration
export type StyleProps = {
  $solid?: boolean;
  $outlined?: boolean;
  $text?: boolean;
};

export enum CSS_STYLE {
  $solid,
  $outlined,
  $text,
}

export function styleConfig(props: StyleProps, callFn: any): string {
  const { $solid, $outlined, $text } = props;
  let ButtonStyle: string[] = [];
  $solid ? ButtonStyle.push("solid") : null;
  $outlined ? ButtonStyle.push("outlined") : null;
  $text ? ButtonStyle.push("text") : null;
  let err;
  // Only one style can be applied
  switch (ButtonStyle.length) {
    case 0:
      err = SyntaxError(
        `Expected 1 styling configuration for '${callFn.name}', received 0.`,
      );
      Error.captureStackTrace(err, callFn);
      throw err;
    case 1:
      return ButtonStyle[0];
    default:
      err = SyntaxError(
        `Expected 1 styling configuration for '${callFn.name}', received ${ButtonStyle.length}.`,
      );
      Error.captureStackTrace(err, callFn);
      throw err;
  }
}
// Size Configuration
export type SizeProps = {
  $xlarge?: boolean;
  $large?: boolean;
  $medium?: boolean;
  $small?: boolean;
};

export enum CSS_SIZE {
  xlg = "$xlarge",
  lg = "$large",
  md = "$medium",
  sm = "$small",
}

export function sizeConfig(props: SizeProps, callFn: any): string {
  const { $xlarge, $large, $medium, $small } = props;
  let ButtonSize: string[] = [];
  $xlarge ? ButtonSize.push("xlg") : null;
  $large ? ButtonSize.push("lg") : null;
  $medium ? ButtonSize.push("md") : null;
  $small ? ButtonSize.push("sm") : null;
  let err;
  switch (ButtonSize.length) {
    case 0:
      err = SyntaxError(
        `Expected 1 sizing configuration for '${callFn.name}', received 0.`,
      );
      Error.captureStackTrace(err, callFn);
      throw err;
    case 1:
      return ButtonSize[0];
    default:
      err = SyntaxError(
        `Expected 1 sizing configuration for '${callFn.name}', received ${ButtonSize.length}.`,
      );
      Error.captureStackTrace(err, callFn);
      throw err;
  }
}

// export class TokenList {
//   private readonly dispatch: Dispatch<string>;
//   private items: string[] = [].concat();

//   /**
//    *
//    * @param initial array of `className`(s) of type `string`
//    * @param dispatch dispatch function returned by `useState`
//    */

//   constructor(initial: string[], dispatch: Dispatch<string>) {
//     this.dispatch = dispatch;
//     if (initial) initial.forEach((token) => this.items.push(token));
//   }

//   /**
//    * @method add() of `TokenList` adds the given tokens to the list,
//    * omitting any that are already present.
//    * @param tokenArg A `string` representing a token (or tokens) to add to the `TokenList`
//    * @returns none
//    * @throws `DOMException` if one of the arguments is an empty `string`
//    * @throws `DOMException` if a token contains ASCII whitespace.
//    */

//   add(...tokenArg: string[]): void {
//     for (const t of tokenArg) {
//       this.validateToken(t, this.add);
//     }
//     const uniqueTokens = tokenArg.filter((t) => !this.contains(t));
//     this.items = this.items.concat(uniqueTokens);
//     this.update();
//   }

//   /**
//    * @method remove() of `TokenList` removes the specified tokens from the list.
//    * After validating input token(s) removes token(s) from `TokenList`
//    * @param tokenArg A `string` representing the token you want to remove from the
//    *  list. If the string is not in the list, no error is thrown, and nothing happens.
//    * @returns `undefined`
//    * @throws `DOMException` if one of the arguments is an empty `string`
//    * @throws `DOMException` if a token contains ASCII whitespace.
//    */

//   remove(...tokenArg: string[]): undefined {
//     for (const t of tokenArg) {
//       this.validateToken(t, this.remove);
//     }
//     this.items = this.items.filter(
//       (item) => !(tokenArg.findIndex((token) => item == token) + 1)
//     );
//     this.update();
//     return undefined;
//   }

//   /**
//    * @method contains()
//    * returns a `boolean` value — `true` if the underlying list contains
//    * the given token, otherwise `false`.
//    * @param token - of type `string`
//    * @returns A `boolean` value, which is `true` if the calling list
//    * contains token, otherwise `false.`
//    */
//   contains(token: string) {
//     return this.items.findIndex((t) => t == token) > -1;
//   }

//   /**
//    * @method replace() replaces an existing token with a new token.
//    * If the first token doesn't exist, replace() returns `false` immediately,
//    * without adding the new token to the token list.
//    * @param oldToken A string representing the token you want to replace.
//    * @param newToken A string representing the token you want to replace `oldToken` with.
//    * @returns A boolean value, which is `true` if oldToken was successfully
//    * replaced, or `false` if not.
//    */
//   replace(oldToken: string, newToken: string): boolean {
//     for (let t of [oldToken, newToken]) {
//       this.validateToken(t, this.replace);
//     }
//     if (this.contains(oldToken)) {
//       this.add(newToken);
//       this.remove(oldToken);
//       return true;
//     }
//     return false;
//   }
//   /**
//    * @method item() returns an item in the list, determined by its position
//    * in the list, its index.
//    * @param index A number representing the index of the item you want to return.
//    * If it isn't an integer, only the integer part is considered.
//    * @returns A `string` representing the returned item, or `null` if the number is
//    * greater than or equal to the length of the list.
//    */

//   item(index: number): string | null {
//     if (index >= this.length) return null;
//     return this.items[index];
//   }

//   /**
//    * @method toggle() removes an existing token from the list and returns false.
//    * If the token doesn't exist it's added and the function returns true.
//    *
//    * @param token A string representing the token you want to toggle.
//    * @param force `optional`
//    * If included, turns the toggle into a one way-only operation.
//    * If set to `false`, then token will only be removed, but not added.
//    * If set to `true`, then token will only be added, but not removed.
//    * @returns A boolean value, `true` or `false`, indicating whether token
//    * is in the list after the call or not.
//    */

//   toggle(token: string, force?: boolean): boolean {
//     this.validateToken(token, this.toggle);
//     if (this.contains(token)) {
//       if (force === undefined || force === false) {
//         this.remove(token);
//         return false;
//       }
//       return true;
//     } else {
//       if (force === undefined || force === true) {
//         this.add(token);
//         return true;
//       }
//       return false;
//     }
//   }

//   /**
//    * emits dispatch call to re-render `React.Component` for new `className`
//    * @returns `true`
//    */

//   private update() {
//     this.dispatch(this.value);
//     return true;
//   }

//   /**
//    * @readonly @property is an `integer` representing the number of objects
//    * stored in the object.
//    */
//   get length(): number {
//     return this.items.length;
//   }

//   /**
//    * @method forEach
//    * Performs the specified action for each element in an array.
//    * @param callbackfn — A function that accepts up to three arguments.
//    * forEach calls the callbackfn function one time for each element in the array.
//    *
//    * @param thisArg — An object to which the this keyword can refer in the
//    * callbackfn function. If thisArg is omitted, undefined is used as the this value.
//    */

//   get forEach(): void {
//     return [].forEach.bind(this.items);
//   }
//   /**
//    * @method keys() returns an `iterator` allowing to go through all keys contained
//    * in this object. The keys are unsigned integers.
//    * @returns an `iterator`.
//    */
//   get keys(): IterableIterator<number> {
//     return [].keys.bind(this.items);
//   }

//   /**
//    * @method entries()
//    * @returns an `iterable` of [key, value] pairs for every entry in the array
//    */

//   get entries(): IterableIterator<[number, string]> {
//     return [].entries.bind(this.items);
//   }
//   /**
//    * @method values() returns an `iterator` allowing the caller to go through
//    * all values contained in the `TokenList`. The individual values are strings.
//    * @returns an `iterator`
//    */
//   get values(): IterableIterator<string> {
//     return [].values.bind(this.items);
//   }

//   /**
//    * @property value is a stringifier that returns the value of the list
//    * serialized as a `string`.
//    */
//   get value(): string {
//     return this.items.join(" ");
//   }

//   toString(): string {
//     return this.value;
//   }

//   /**
//    * @private @method `validateToken` throws error if token constrains are not satisfied.
//    * @param token A `string` represention of the token
//    * @param callFn function which called the validator
//    * @throws `DOMException` if token is an empty `string`
//    * @throws `DOMException` if token contains ASCII whitespace.
//    */

//   private validateToken(token: string, callFn: (...args: any[]) => any) {
//     let err = new DOMException();
//     if (!token.length) {
//       err = new DOMException(
//         `Failed to execute '${callFn.name}' on 'TokenList': The token provided must not be empty.`
//       );
//       Error.captureStackTrace(err, callFn);
//       throw err;
//     }

//     if (/\s+/.test(token)) {
//       err = new DOMException(
//         `Failed to execute '${callFn.name}' on 'TokenList': The token provided (${token}) contains HTML space characters, which are not valid in tokens.`
//       );
//       Error.captureStackTrace(err, callFn);
//       throw err;
//     }
//   }

//   private *[Symbol.iterator]() {
//     for (const item of this.items) {
//       yield item;
//     }
//   }

//   private get [Symbol.toStringTag]() {
//     return "TokenList";
//   }
// }
/**
 * Returns a stateful `className` and a `TokenList` object to manuplate
 * classNames
 * @param className
 * @returns an array consist of `className` and `TokenList` Object
 *
 * @example [className, classList] = useClassList("cls1", "cl2", ...);
 * return  <div {...className}></div>
 */
// export function useClassList(
//   ...className: string[]
// ): [{ className: string }, TokenList] {
//   let [value, dispatch] = useState<string>(className.join(" "));
//   let [tokenList] = useState(new TokenList(className, dispatch));
//   return [Object.freeze({ className: value }), tokenList];
// }

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
export function useDimensions<T extends HTMLElement>(ref: MutableRefObject<T>) {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
  }, []);

  return dimensions.current;
}

/**
 * `useDoubleTap` hook adds an `DoubleTapEventListener` by counting
 * `TouchEnd` and measuring the time gap between them.
 *
 * @param ref a Ref to DOM Element
 * @param callbackfn callback function to event. receives `EventObject`
 * and an `AbortController` to abort Event when necessary.
 */

export function* useDoubleTap<T extends HTMLElement>(ref: MutableRefObject<T>) {
  let callbackfn: ((Event?: TouchEvent) => void) | undefined = undefined;
  /* Regex test to determine if user is on mobile */
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    // initiallizing an abort controller and pass it to callBackFn
    // as an argument. This way component can remove the EventListener
    // on the next re-render.
    let previousListenerExist = false;
    let controller: AbortController | undefined = undefined;
    while (true) {
      if (!previousListenerExist) {
        controller = new AbortController();
        const signal = controller.signal;

        const doubleTapCallback = detectDoubleTapClosure();
        ref.current.addEventListener("touchend", doubleTapCallback, {
          passive: false,
        });
        previousListenerExist = true;

        signal.onabort = () => {
          ref.current.removeEventListener("touchend", doubleTapCallback);
          previousListenerExist = false;
        };
      }
      callbackfn = yield controller;
    }
  }

  function detectDoubleTapClosure() {
    let lastTap = 0;
    let timeout: any;

    return function detectDoubleTap(event: any) {
      const curTime = new Date().getTime();
      const tapLen = curTime - lastTap;
      if (tapLen < 500 && tapLen > 0) {
        if (callbackfn) callbackfn(event);
        event.preventDefault();
      } else {
        timeout = setTimeout(() => {
          clearTimeout(timeout);
        }, 500);
      }
      lastTap = curTime;
    };
  }
}

export function filterTransientProps<T>(Props: T): {
  [Property in Exclude<keyof T, keyof SizeProps | keyof StyleProps>]: boolean;
} {
  const filteredProps = Object.assign({}, Props);
  for (let key in Props) {
    if (/^\$/.test(key)) delete filteredProps[key];
  }
  return filteredProps as any;
}

import { ParsedUrlQuery } from "querystring";

export type ProjectId = string & `p${number}`;

export type IProject = {
  title: string;
  id: ProjectId;
  due?: string;
  description?: string;
  priority?: Priority;
  categoryId?: CategoryId;
  projectId?: ProjectId;
};

export type CategoryId = string & `c${number}`;
export type ICategory = {
  title: string;
  id: CategoryId;
  categoryId?: CategoryId;
};

export type TaskId = string & `t${number}`;
export type ITask = {
  title: string;
  id: TaskId;
  status: boolean;
  description?: string;
  subtasks?: ISubTask[];
  projectId?: ProjectId;
  categoryId?: CategoryId;
  due?: string;
  notification?: string;
  priority?: Priority;
};

export type ISubTask = { title: string; id: number; status: boolean };

export enum Priority {
  High = 2,
  Medium = 1,
  Low = 0,
}

export type Data = {
  tasks: ITask[];
  projects: IProject[];
  categories: ICategory[];
};

/**
 * Small UtilityFunction to filter a key in an Indexed Type
 */
export type Filter<K, P> = {
  [Property in keyof P as Exclude<Property, K>]: P[Property];
};

/**
 * performs quickSort algorithem
 * @param array
 * @param high
 * @param low
 * @param extract
 * @returns
 */
export function quickSort<T>(
  array: T[],
  high: number,
  low: number,
  extract?: (arg: T) => number | string | T,
): T[] {
  if (low < high) {
    // find pivot element such that
    // element smaller than pivot are on the left
    // element greater than pivot are on the right
    const pi = partition(high, low);

    // recursive call on the left of pivot
    quickSort(array, pi - 1, low, extract);

    // recursive call on the right of pivot
    quickSort(array, high, pi + 1, extract);
  }
  return array;

  function partition(high: number, low: number) {
    // choose the rightmost element as pivot
    const pivot = array[high];

    // pointer for greater element
    let i = low - 1;

    // set extract if not defined
    if (!extract) extract = (val: any) => val;

    // traverse through all elements
    // compare each element with pivot
    for (let j = low; j < high; j++) {
      if (extract(array[j]) <= extract(pivot)) {
        // if element smaller than pivot is found
        // swap it with the greatr element pointed by i
        i++;

        // swapping element at i with element at j
        swap(array, i, j);
      }
    }

    // swapt the pivot element with the greater element specified by i
    swap(array, i + 1, high);

    // return the position from where partition is done
    return i + 1;
  }

  // Function to swap two elements
  function swap<T>(arr: T[], i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * performs type checking for Ids
 * TaskId starts with `t`
 * ProjectId starts with `p`
 * CategoryId starts with `c`
 * @param id
 * @param init
 * @returns true / false
 */
export function IdCheck<T extends CategoryId | ProjectId | TaskId>(
  id: any,
  init: "c" | "p" | "t",
): id is T {
  return id.slice(0, 1) === init;
}

export type NavigationQueryList = {
  calendar: DueDate;
  clock: DueTime;
  selection_in_categories: SelectionInCategories;
  selection_in_projects: SelectionInProjects;
  selection_in_tasks: SelectionInTasks;
  task_filter: TaskFilter;
  project_filter: ProjectFilter;
  new_task_form_data: NewTaskFormData;
  edit_task_form_data: EditTaskFormData;
  new_category: NewCategory;
  new_project_form_data: NewProjectFormData;
  edit_project_form_data: EditProjectFormData;
};

export const enum NavigationQuery {
  CALENDAR = "calendar",
  CLOCK = "clock",
  SELECTION_IN_CATEGORIES = "selection_in_categories",
  SELECTION_IN_PROJECTS = "selection_in_projects",
  SELECTION_IN_TASKS = "selection_in_tasks",
  TASK_FILTER = "task_filter",
  PROJECT_FILTER = "project_filter",
  NEW_TASK_FORM_DATA = "new_task_form_data",
  EDIT_TASK_FORM_DATA = "edit_task_form_data",
  NEW_CATEGORY = "new_category",
  NEW_PROJECT_FORM_DATA = "new_project_form_data",
  EDIT_PROJECT_FORM_DATA = "edit_project_form_data",
}

export type RouteNavigation<P> = {
  query: NavigationQuery;
  params: P;
  refer: string | string[];
  caller?: NavigationQuery;
  pop?: boolean;
};

export type CalendarDate =
  | (string & `${number}-${number}-${number}`)
  | (string & `${number}-${string}-${string}`);

export type ClockTime = (string & `${number}:${number}`) | undefined;

export type SelectionInCategories = {
  selectedItems: number;
  action: "move" | "delete" | undefined;
};

export type SelectionInTasks = {
  selectedItems: number;
  action: "edit" | "delete" | undefined;
};

export type SelectionInProjects = SelectionInTasks;

export type ProjectFilter = {
  search?: string;
  date?: CalendarDate;
  time?: ClockTime;
  category?: CategoryId;
  priority?: Priority;
  completed?: boolean;
};

export type TaskFilter = {
  search?: string;
  date?: CalendarDate;
  time?: ClockTime;
  category?: CategoryId;
  project?: ProjectId;
  priority?: Priority;
  completed?: boolean;
};

export type NewTaskFormData = {
  title: string;
  description?: string;
  date: string;
  time: string;
  projectId?: ProjectId;
  categoryId?: CategoryId;
  priority?: number;
  notification?: string;
  subtasks: ISubTask[];
};

export type EditTaskFormData = {
  id: TaskId;
  title: string;
  description?: string;
  date: string;
  time: string;
  projectId?: ProjectId;
  categoryId?: CategoryId;
  priority?: number;
  notification?: string;
  subtasks: ISubTask[];
};

export type NewProjectFormData = {
  title: string;
  description?: string;
  date: string;
  time: string;
  projectId?: ProjectId;
  categoryId?: CategoryId;
  priority?: number;
};

export type EditProjectFormData = {
  id: ProjectId;
  title: string;
  description?: string;
  date: string;
  time: string;
  projectId?: ProjectId;
  categoryId?: CategoryId;
  priority?: number;
};

export type NewCategory = { title: string; categoryId: CategoryId };

export type DueDate = { date: CalendarDate };

export type DueTime = { time: ClockTime };

/**
 * decodes UrlSearchParameters and returns a NavigationQuery
 * @param query a Navigation Query to parse parameters
 * @param params returned value of query in useRouter hook
 * @returns structured `NavigationQuery` available in `NavigationQueryList`
 *
 * @example
 * const router = useRouter();
 * const nav = decodeNavigationParams("new_task_form_data", router.query)
 */
export function decodeNavigationParams<Q extends keyof NavigationQueryList>(
  query: Q,
  params: ParsedUrlQuery,
) {
  const pop = "pop" in params ? (params.pop == "true" ? true : false) : false;
  const refer = "refer" in params ? params.refer : undefined;
  const caller = "caller" in params ? params.caller : undefined;

  let newParams = {};

  const subtasks: Partial<ISubTask>[] = [];

  switch (query) {
    case NavigationQuery.CALENDAR:
      newParams = {
        date:
          "date" in params
            ? isCalendarDate(params.date)
              ? params.date
              : undefined
            : undefined,
      };
      break;

    case NavigationQuery.CLOCK:
      newParams = {
        time:
          "time" in params
            ? isCalendarDate(params.time)
              ? params.time
              : undefined
            : undefined,
      };
      break;

    case NavigationQuery.SELECTION_IN_CATEGORIES:
      newParams = {
        action:
          "action" in params
            ? isCategoryAction(params.action)
              ? params.action
              : undefined
            : undefined,
        selectedItems: Number(
          "selectedItems" in params ? params.selectedItems : 0,
        ),
      };
      break;

    case NavigationQuery.SELECTION_IN_TASKS:
      newParams = {
        action:
          "action" in params
            ? isTaskAction(params.action)
              ? params.action
              : undefined
            : undefined,
        selectedItems: Number(
          "selectedItems" in params ? params.selectedItems : 0,
        ),
      };
      break;

    case NavigationQuery.SELECTION_IN_PROJECTS:
      newParams = {
        action:
          "action" in params
            ? isTaskAction(params.action)
              ? params.action
              : undefined
            : undefined,
        selectedItems: Number(
          "selectedItems" in params ? params.selectedItems : 0,
        ),
      };
      break;

    case NavigationQuery.TASK_FILTER:
      newParams = {
        search: "search" in params ? params.search : undefined,
        category:
          "category" in params
            ? isCategoryId(params.category)
              ? params.category
              : undefined
            : undefined,
        project:
          "project" in params
            ? isProjectId(params.project)
              ? params.project
              : undefined
            : undefined,
        priority:
          "priority" in params
            ? isPriority(params.priority)
              ? Number(params.priority)
              : undefined
            : undefined,
        date:
          "date" in params
            ? isCalendarDate(params.date)
              ? params.date
              : undefined
            : undefined,
        time:
          "time" in params
            ? isClockTime(params.time)
              ? params.time
              : undefined
            : undefined,
        completed:
          "completed" in params ? params.completed === "true" : undefined,
      };
      break;

    case NavigationQuery.PROJECT_FILTER:
      newParams = {
        category:
          "category" in params
            ? isCategoryId(params.category)
              ? params.category
              : undefined
            : undefined,
        priority:
          "priority" in params
            ? isPriority(params.priority)
              ? Number(params.priority)
              : undefined
            : undefined,
        date:
          "date" in params
            ? isCalendarDate(params.date)
              ? params.date
              : undefined
            : undefined,
        time:
          "time" in params
            ? isClockTime(params.time)
              ? params.time
              : undefined
            : undefined,
        completed:
          "completed" in params ? Boolean(params.completed) : undefined,
      };
      break;

    case NavigationQuery.NEW_TASK_FORM_DATA:
      Object.keys(params)
        .filter((v) => /^s[0-9]+/.test(v))
        .forEach((key) =>
          subtasks.push({
            title: params[key] as string,
            id: Number(key.slice(1)),
            status: false,
          }),
        );

      newParams = {
        date: isCalendarDate(params.date) ? params.date : undefined,
        time: isClockTime(params.time) ? params.time : undefined,
        title: !Array.isArray(params.title) ? params.title : undefined,
        categoryId: isCategoryId(params.categoryId)
          ? params.categoryId
          : undefined,
        projectId: isProjectId(params.projectId) ? params.projectId : undefined,
        description: !Array.isArray(params.description)
          ? params.description
          : undefined,
        priority: isPriority(params.priority)
          ? Number(params.priority)
          : undefined,
        notification: !Array.isArray(params.notification)
          ? params.notification
          : undefined,
        subtasks,
      };
      break;

    case NavigationQuery.EDIT_TASK_FORM_DATA:
      Object.keys(params)
        .filter((v) => /^s[0-9]+/.test(v))
        .forEach((key) =>
          subtasks.push({
            title: params[key] as string,
            status: params["s" + key] == "false" ? false : true,
            id: Number(key.slice(1)),
          }),
        );
      newParams = {
        id: isTaskId(params.id) ? params.id : undefined,
        date: isCalendarDate(params.date) ? params.date : undefined,
        time: isClockTime(params.time) ? params.time : undefined,
        title: !Array.isArray(params.title) ? params.title : undefined,
        categoryId: isCategoryId(params.categoryId)
          ? params.categoryId
          : undefined,
        projectId: isProjectId(params.projectId) ? params.projectId : undefined,
        description: !Array.isArray(params.description)
          ? params.description
          : undefined,
        priority: isPriority(params.priority)
          ? Number(params.priority)
          : undefined,
        notification: !Array.isArray(params.notification)
          ? params.notification
          : undefined,
        subtasks,
      };
      break;

    case NavigationQuery.NEW_CATEGORY:
      newParams = {
        title: "title" in params ? params.title : undefined,
        categoryId: isCategoryId(params.categoryId)
          ? params.categoryId
          : undefined,
      };
      break;

    case NavigationQuery.NEW_PROJECT_FORM_DATA:
      newParams = {
        date: isCalendarDate(params.date) ? params.date : undefined,
        time: isClockTime(params.time) ? params.time : undefined,
        title: !Array.isArray(params.title) ? params.title : undefined,
        categoryId: isCategoryId(params.categoryId)
          ? params.categoryId
          : undefined,
        projectId: isProjectId(params.projectId) ? params.projectId : undefined,
        description: !Array.isArray(params.description)
          ? params.description
          : undefined,
        priority: isPriority(params.priority)
          ? Number(params.priority)
          : undefined,
        notification: !Array.isArray(params.notification)
          ? params.notification
          : undefined,
      };
      break;

    case NavigationQuery.EDIT_PROJECT_FORM_DATA:
      newParams = {
        id: isProjectId(params.id) ? params.id : undefined,
        date: isCalendarDate(params.date) ? params.date : undefined,
        time: isClockTime(params.time) ? params.time : undefined,
        title: !Array.isArray(params.title) ? params.title : undefined,
        categoryId: isCategoryId(params.categoryId)
          ? params.categoryId
          : undefined,
        projectId: isProjectId(params.projectId) ? params.projectId : undefined,
        description: !Array.isArray(params.description)
          ? params.description
          : undefined,
        priority: isPriority(params.priority)
          ? Number(params.priority)
          : undefined,
        notification: !Array.isArray(params.notification)
          ? params.notification
          : undefined,
      };
      break;
  }

  if (query !== params.query) {
    return {
      query,
      params: newParams,
      pop: false,
      caller,
      refer,
    } as RouteNavigation<NavigationQueryList[Q]>;
  }
  return { query, params: newParams, refer, caller, pop } as RouteNavigation<
    NavigationQueryList[Q]
  >;
}

/**
 * flattens the navigation params for URLSearchParams
 * @param navigationQuery
 * @param untouchedQuery from router
 * @returns
 */
export function encodeNavigationParams<T>(
  navigationQuery: RouteNavigation<T>,
  untouchedQuery: ParsedUrlQuery,
) {
  // in AddTaskPage and EditTaskPage subtasks title and status
  // must be removed from untouchedQuery before adding new ones
  for (const key in untouchedQuery) {
    if (/s[0-9]+/.test(key)) delete untouchedQuery[key];
  }

  const params = {
    ...untouchedQuery,
    query: navigationQuery.query,
    refer: navigationQuery.refer,
    caller: navigationQuery.caller,
    pop: navigationQuery.pop,
    ...navigationQuery.params,
  };

  const searchparams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    value !== undefined && searchparams.append(key, String(value));
  });

  return searchparams;
}

/**
 * prepares the form data in Add/Edit Task Page before passing to `encodeNavigationParams`
 * @param fd FormData
 * @returns flattened data
 */
export function flattenTaskData<T extends EditTaskFormData | ITask>(fd: T) {
  const flat = {
    id: fd.id,
    title: fd.title,
    categoryId: fd.categoryId,
    projectId: fd.projectId,
    description: fd.description,
    priority: fd.priority,
    notification: undefined,
    date: "",
    time: "",
  } as any;
  if ("due" in fd && typeof fd.due === "string") {
    const d = new Date(fd.due);
    flat.date = date2str(d);
    flat.time = date2time(d);
  } else {
    if ("date" in fd && "time" in fd) {
      flat.date = fd.date.length ? (date2str(fd.date) as string) : undefined;
      flat.time = fd.time.length ? date2time(str2date(fd.time)) : undefined;
    }
  }
  for (let i in fd.subtasks) {
    flat[`s${fd.subtasks[i as any].id}`] = fd.subtasks[i as any].title;
    flat[`ss${fd.subtasks[i as any].id}`] = fd.subtasks[i as any].status;
  }
  return flat as EditTaskFormData;
}

/**
 * prepares the form data in Add/Edit Project Page before passing to `encodeNavigationParams`
 * @param fd FormData
 * @returns flattened data
 */
export function flattenProjectData<P extends EditProjectFormData | IProject>(
  fd: P,
) {
  const flat = {
    id: fd.id,
    title: fd.title,
    categoryId: fd.categoryId,
    projectId: fd.projectId,
    description: fd.description,
    priority: fd.priority,
    notification: undefined,
    date: "",
    time: "",
  } as any;
  if ("due" in fd && typeof fd.due === "string") {
    const d = new Date(fd.due);
    flat.date = date2str(d);
    flat.time = date2time(d);
  } else {
    if ("date" in fd && "time" in fd) {
      flat.date = fd.date.length ? date2str(fd.date) : undefined;
      flat.time = fd.time.length ? date2time(str2date(fd.time)) : undefined;
    }
  }
  return flat as EditProjectFormData;
}

type FilterFn = {
  [Property in keyof TaskFilter]: (
    arg: TaskFilter[Property],
  ) => (arg: ITask) => boolean;
};

/**
 * `FilterFn` is an object containing predicates for filtering tasks
 * each `key` is parameter which user may filter tasks based on
 */
// export const FilterFn: FilterFn = {
//   /**
//    * `search` looks up in title, subtask title, and descriptions of tasks
//    * @param str
//    * @returns boolean
//    */
//   search(str: string) {
//     let newStr = str.trim();
//     newStr.replaceAll(/\s+/gim, "|");
//     const re = new RegExp(newStr, "ig");
//     return ({ title, subtasks, description }) => {
//       const search = [
//         title,
//         description,
//         ...subtasks.map((st) => st.title),
//       ].map((txt) => re.test(txt));
//       return search.some((b) => b);
//     };
//   },

//   /**
//    * matches due data
//    * @param date
//    * @returns boolean
//    */
//   date(date: string) {
//     const day = str2date(date);
//     day.setHours(0, 0, 0);
//     const dayAfter = str2date(date);
//     dayAfter.setHours(24, 0, 0, 0);
//     return ({ due }) => {
//       const d = str2date(due);
//       if (d >= day && d < dayAfter) return true;
//       return false;
//     };
//   },

//   /**
//    * matches due time
//    * @param time
//    * @returns boolean
//    */
//   time(time: string) {
//     return ({ due }) => {
//       const t = str2date(due);
//       return date2time(t) === time;
//     };
//   },

//   /**
//    * matches categoryId
//    * @param id
//    * @returns boolean
//    */
//   category(id: CategoryId) {
//     return ({ categoryId }) => id === categoryId;
//   },

//   /**
//    * matches projectId
//    * @param id
//    * @returns boolean
//    */
//   project(id: ProjectId) {
//     return ({ projectId }) => id === projectId;
//   },

//   /**
//    * matches priority
//    * @param p
//    * @returns boolean
//    */
//   priority(p: Priority) {
//     return ({ priority }) => priority === p;
//   },

//   /**
//    * matches finished tasks
//    * @param s if false, doesn't filter at all
//    * @returns boolean
//    */
//   completed(s: boolean) {
//     return ({ subtasks, status }) => {
//       if (s)
//         return subtasks
//           .map((st) => st.status)
//           .concat(status)
//           .every((stat) => stat);
//       return true;
//     };
//   },
// };

//
//
//
//            Date / Time Converters
//
//
//

/**
 * converts given string or date object to "YYYY-MM-DD"
 * @param date standard `Date` string or `Date` object
 * @returns string date in format "YYYY-MM-DD"
 */
export function date2str(date: Date | string): CalendarDate {
  if (typeof date === "string") date = new Date(date);
  return `${date.getFullYear()}-${num2str(date.getMonth() + 1)}-${num2str(
    date.getDate(),
  )}`;
}

/**
 * converts given string or date object to "`MonthName` `DayWithOrdinal`"
 * @param date
 * @example date2display(d) // Sep 21st
 */
export function date2display(date: Date | string): string {
  if (typeof date === "string") date = new Date(date);
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const db = new Date(); // day before `d`
  db.setHours(-24, 0, 0, 0);

  const jumpADay = () => {
    d.setHours(24, 0, 0, 0);
    db.setHours(24, 0, 0, 0);
  };

  if (date < d && date > db) return "yesterday";
  jumpADay();
  if (date < d && date > db) return "today";
  jumpADay();
  if (date < d && date > db) return "tomorrow";

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const ordinal =
    day >= 11 && day <= 13 ? "th" : ["st", "nd", "rd"][(day % 10) - 1] || "th";
  const year =
    date.getFullYear() === new Date().getFullYear() ? "" : date.getFullYear();
  return `${month[date.getMonth()]}  ${day}${ordinal}${"  " + year}`;
}

/**
 * converts standard ISO/JSON stringified date to `Date` object
 * @param str
 * @returns `Date`
 */
export function str2date(str: string | any) {
  return new Date(str);
}

/**
 * add a 0 before one digit numbers
 * @param n
 * @example num2str(5) // "05"
 */
export function num2str(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * converts an array consist of HH and MM to 24h timstring
 * @param n
 * @returns "HH:MM"
 */
export function num2timestring(n: number[]) {
  return `${num2str(n[0])}:${num2str(n[1])}` as ClockTime;
}

/**
 * converts 24h timestring to an array
 * @param s
 * @returns `[HH, MM]`
 */
export function str2time(s: string | any): number[] {
  return s.split(":").map((v: string) => Number(v));
}

/**
 * converts 12h time string to 24h format
 * @param s
 * @returns "HH:MM"
 */
export function localTimeToTime(s: string) {
  if (s.length == 0) return undefined;

  return date2time(new Date(s));
}

/**
 * converts ISO/JSON stringified `Date` to local timestring
 * @param s
 * @returns time in format "HH:MM AM/PM"
 */
export function timeToLocalTime(s: string) {
  const d = new Date("0 " + s);
  return d.toLocaleTimeString().replace(":00", "");
}

/**
 * converts a given `Date` object into local timestring
 * @param d
 * @returns time in format "HH:MM AM/PM"
 */
export function dateToLocalTime(d: Date) {
  let HH = d.getHours(),
    MM = d.getMinutes(),
    ampm = HH >= 12 ? "PM" : "AM";
  HH = HH % 12;
  HH = HH ? HH : 12; // the hour '0' should be '12'
  return `${num2str(HH)}:${num2str(MM)} ${ampm}`;
}

/**
 * converts a given `Date` object into timestring
 * @param d
 * @returns time in format "HH:MM"
 */
export function date2time(d: Date) {
  let HH = d.getHours(),
    MM = d.getMinutes();
  return `${num2str(HH)}:${num2str(MM)}` as ClockTime;
}

//
//
//
//          Parameter Type Chekcers
//
//
//

export function isCalendarDate(queryParams: any): queryParams is CalendarDate {
  return /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/.test(queryParams);
}

export function isClockTime(queryParams: any): queryParams is ClockTime {
  return /[0-9]{2}:[0-9]{2}/.test(queryParams);
}
export function isCategoryAction(
  queryParams: any,
): queryParams is "move" | "delete" {
  return /(move)|(delete)/.test(queryParams);
}

export function isTaskAction(
  queryParams: any,
): queryParams is "edit" | "delete" {
  return /(edit)|(delete)/.test(queryParams);
}

export function isCategoryId(id: any): id is CategoryId {
  return /^c[0-9]+/.test(id);
}

export function isProjectId(id: any): id is ProjectId {
  return /^p[0-9]+/.test(id);
}

export function isTaskId(id: any): id is TaskId {
  return /^t[0-9]+/.test(id);
}

export function isPriority(priority: any): priority is Priority {
  return /[0-2]/.test(priority);
}

export function wildCard(n: number | string) {
  const num = typeof n == "string" ? parseInt(n) : n;
  return num < 10 ? "0" + num : num.toString();
}
