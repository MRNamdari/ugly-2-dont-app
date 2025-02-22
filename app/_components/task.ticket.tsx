import Icon from "@/app/_components/icon";
import { date2display } from "@/app/_store/util";
import { db, ISubTask, ITask, Priority } from "@/app/_store/db";
import {
  AddToSelection,
  IsSelected,
  isSelectionStarted,
  RemoveFromSelection,
} from "@/app/_store/state";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, PanInfo } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import { DeleteContext } from "./delete.modal";

export default forwardRef<HTMLElement, ITask>(function TaskTicket(
  props: ITask,
  ref,
) {
  const router = useRouter();
  const deleteModal = useContext(DeleteContext);
  const [project, category] = useLiveQuery(
    async () => {
      return [
        props.project !== undefined
          ? await db.projects.get(props.project)
          : undefined,
        props.category !== undefined
          ? await db.categories.get(props.category)
          : undefined,
      ];
    },
    [props.project, props.category],
    [undefined, undefined],
  );
  const [isExpanded, setExpansion] = useState<boolean>(false);
  const [isSelected, setSelection] = useState<boolean>(
    IsSelected("task", props.id),
  );
  useSignalEffect(() => {
    setSelection(IsSelected("task", props.id));
  });
  const dragEnded = useRef<{ info: PanInfo | null }>({ info: null });
  const hasSubtasks =
    Array.isArray(props.subtasks) && props.subtasks.length > 0;
  const [status, setStatus] = useState(
    props.subtasks?.map((st) => st.status) ?? [],
  );
  const subtaskProgress =
    status.reduce((p, c) => p + (c ? 1 : 0), 0) / status.length;
  const [isChecked, setCheckbox] = useState<boolean>(
    hasSubtasks ? subtaskProgress == 1 : props.status,
  );

  const progress = hasSubtasks ? subtaskProgress : isChecked ? 1 : 0;

  const clickEvent = useRef({ timeStamp: 0 });

  async function MainCheckboxChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const chk = e.target.checked;
    if (hasSubtasks) {
      setStatus(Array.from(status).fill(chk));
      await db.tasks.update(props.id, {
        status: chk,
        subtasks: props.subtasks?.map((st) => ({
          ...st,
          status: chk,
        })),
      });
    } else {
      await db.tasks.update(props.id, {
        status: chk,
      });
    }
    setCheckbox(chk);
  }
  function SubtaskChangeHandlerMapper(st: ISubTask, i: number) {
    return async function SubtaskCheckboxChangeHandler(
      e: ChangeEvent<HTMLInputElement>,
    ) {
      setStatus(
        status.map((s, idx) => {
          if (idx == i) return e.target.checked;
          return s;
        }),
      );
      await onSubtaskStatusChange(props.id, st.id, e.target.checked);
    };
  }
  function ClickHandler(e: MouseEvent<HTMLDivElement>) {
    if (isSelectionStarted.value) {
      if (clickEvent.current !== null) {
        if (e.timeStamp - clickEvent.current.timeStamp < 250) {
          setExpansion(!isExpanded);
          return;
        } else {
          clickEvent.current.timeStamp = e.timeStamp;
          new Promise((resolve) => {
            setTimeout(() => resolve((clickEvent.current.timeStamp = 0)), 255);
          });
        }
      }
    }
    if (isSelectionStarted.value) {
      if (isSelected) {
        RemoveFromSelection("task", props.id);
      } else {
        AddToSelection("task", props.id);
      }
      return;
    }
    if (e.target instanceof HTMLInputElement) return;
    setExpansion(!isExpanded);
  }
  function DoubleClickHandler(e: MouseEvent<HTMLDivElement>) {
    if (isSelectionStarted.value) {
      if (e.target instanceof HTMLInputElement) return;
      setExpansion(!isExpanded);
    }
  }
  function ContextMenuHandler(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    AddToSelection("task", props.id);
  }
  function DragEndHandler(e: unknown, info: PanInfo) {
    dragEnded.current.info = info;
  }
  function DragTransitionEndHandler() {
    const info = dragEnded.current.info;
    if (info && Math.abs(info.offset.x) > 90)
      if (info.offset.x > 0) onDelete();
      else router.push(`/pwa/tasks/edit/${props.id}`);
  }
  function onDelete() {
    deleteModal.onClose = (value) => {
      if (value === "true") {
        db.tasks.delete(props.id);
      }
    };
    deleteModal.showModal(`Sure wanna delete “${props.title}” task?`);
  }
  return (
    <motion.article
      ref={ref}
      className="relative before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:h-[calc(100%+2rem)] before:w-screen before:-translate-x-1/2 before:-translate-y-1/2 before:transition-colors before:duration-700 aria-selected:before:bg-secondary-100"
      id={"t" + props.id}
      initial={{ opacity: 0, marginBottom: 0 }}
      animate={{ opacity: 1, marginBottom: "1rem" }}
      exit={{ opacity: 0, marginBottom: 0, height: 0 }}
    >
      <div className="absolute left-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-start rounded-l-2xl bg-error-100 p-4">
        <Icon label="Trash" size={24} className="size-6 text-error-500" />
      </div>
      <div className="absolute right-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-end rounded-r-2xl bg-warning-100 p-4">
        <Icon label="Edit" size={24} className="size-6 text-warning-600" />
      </div>
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragTransition={{ bounceStiffness: 400 }}
        onDragTransitionEnd={DragTransitionEndHandler}
        aria-selected={isSelected}
        className="grid gap-2 rounded-3xl bg-gray-100 p-6 aria-selected:bg-secondary-50"
        onClick={ClickHandler}
        onDoubleClick={DoubleClickHandler}
        onContextMenu={ContextMenuHandler}
        onDragEnd={DragEndHandler}
      >
        <span className="grid grid-cols-[auto_2rem]">
          <h4 className="font-medium">{props.title}</h4>
          <span className="relative">
            <input
              type="checkbox"
              className="absolute inset-0 h-full w-full appearance-none"
              defaultChecked={isChecked}
              onChange={MainCheckboxChangeHandler}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8 place-self-end text-primary-700"
              viewBox="0 0 36 36"
            >
              <circle
                cx={18}
                cy={18}
                r={15}
                className={
                  "transition-all duration-500 " +
                  (progress === 1
                    ? "fill-current stroke-current"
                    : "fill-white stroke-gray-200")
                }
                strokeWidth={4}
              ></circle>
              <circle
                cx={18}
                cy={18}
                r={15}
                className="origin-center rotate-[200deg] fill-none transition-all duration-500"
                stroke="currentColor"
                strokeWidth={4}
                pathLength={0.99}
                strokeDasharray={"1.01 1"}
                strokeLinecap="round"
                strokeDashoffset={-1 + progress}
              ></circle>
              <polyline
                className="fill-none stroke-white transition-all delay-300 duration-500"
                pathLength={0.99}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1.01 1"
                points="25.05 13.95 15.15 23.85 10.65 19.35"
                strokeDashoffset={progress === 1 ? 0 : -1}
              ></polyline>
            </svg>
          </span>
        </span>
        <h5 className="text-base text-primary-600">
          {project && (
            <Link
              className="underline"
              href={"/pwa/projects/details/" + project.id}
            >
              {project.title}
            </Link>
          )}
          {category && project && " • "}
          {category && (
            <Link
              className="underline"
              href={"/pwa/categories/details/" + category.id}
            >
              {category.title}
            </Link>
          )}
        </h5>
        <span
          className={
            "grid gap-[inherit] overflow-hidden border-b-2 transition-[grid-template-rows] duration-500 " +
            (isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
          }
        >
          <span className="grid min-h-0 gap-[inherit]">
            <p className="text-sm text-primary-700">{props.description}</p>
            <menu>
              {props.subtasks?.map((st, i) => (
                <li
                  key={st.id}
                  className="subtask flex items-center gap-2 py-1 text-sm"
                >
                  <div className="inline-flex size-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-primary-50">
                    {i + 1}
                  </div>
                  <p className="flex-grow">{st.title}</p>
                  <span className="relative">
                    <input
                      type="checkbox"
                      className="absolute inset-0 h-full w-full appearance-none"
                      defaultChecked={status[i]}
                      onChange={SubtaskChangeHandlerMapper(st, i)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 place-self-end text-primary-700"
                      viewBox="0 0 20 20"
                    >
                      <circle cx={10} cy={10} r={8} strokeWidth={4}></circle>
                      <circle cx={10} cy={10} r={6} strokeWidth={0}></circle>
                      <polyline
                        pathLength={0.99}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="1.01 1"
                        points="13.92 7.75 8.42 13.25 5.92 10.75"
                      ></polyline>
                    </svg>
                  </span>
                </li>
              ))}
            </menu>
          </span>
        </span>
        <div className="flex w-full gap-1 text-sm">
          {/* <p className="flex-grow text-xs text-primary-600">
            {props.date && date2display(new Date(props.date))}
          </p> */}
          <DynamicDue date={props.date} time={props.time} />
          {props.reminder && (
            <Icon
              label="Bell"
              size={14}
              className="size-6 rounded-md bg-gray-200 text-gray-500"
            />
          )}
          {props.subtasks && props.subtasks.length > 0 && (
            <Icon
              label="GitPullRequest"
              size={14}
              className="size-6 rounded-md bg-gray-200 text-gray-500"
            />
          )}
          <p
            className={
              "size-6 flex-grow-0 rounded-md text-center align-middle " +
              (props.priority === 0
                ? "bg-error-100 text-error-600"
                : props.priority === 1
                  ? "bg-warning-100 text-warning-600"
                  : "bg-secondary-100 text-secondary-600")
            }
          >
            {(props.priority as 0 | 1 | 2 | undefined) !== undefined &&
              Priority[props.priority as 0 | 1 | 2].slice(0, 1)}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
});

async function onSubtaskStatusChange(
  taskId: number,
  subtaskId: number,
  status: boolean,
) {
  const task = await db.tasks.get(taskId);
  if (!task) return;
  const subtasks = task.subtasks?.map((s) => {
    if (s.id == subtaskId) return { ...s, status };
    return s;
  });

  return await db.tasks.update(taskId, {
    status: subtasks?.every((s) => s.status) ?? task.status,
    subtasks,
  });
}

function DynamicDue({ time, date }: { time: Date; date: Date }) {
  date.setHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);
  const unitArray = ["sec", "min", "hour"] as const;
  const dividedBy = [
    1,
    60,
    60 ** 2,
    24 * 60 ** 2,
    30 * 24 * 60 ** 2,
    365 * 24 * 60 ** 2,
  ];
  const unitFilter: ((r: number) => boolean)[] = [
    (r) => r < 61,
    (r) => r < 61,
    (r) => r < 25,
    (r) => r < 99,
    (r) => r < 13,
    () => true,
  ];
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    let delay = 0;
    const timeout = setInterval(() => {
      const remainedInSec = (date.getTime() - Date.now()) / 1e3;
      if (0 < remainedInSec && remainedInSec < 3600) {
        delay = 30 * 1e3;
        if (remainedInSec < 60) delay = 1e3;
        const remainedInUnit = Array.from(dividedBy, (d) =>
          Math.floor(remainedInSec / d),
        );
        const index = remainedInUnit.findIndex((r, i) => unitFilter[i](r));
        const count = remainedInUnit[index];
        const unit = unitArray[index];
        setContent(count + unit);
      } else {
        setContent(date2display(date));
        clearInterval(timeout);
      }
    }, delay);
    return () => clearInterval(timeout);
  }, [time, date, content]);

  return <p className="flex-grow text-xs text-primary-600">{content}</p>;
}
