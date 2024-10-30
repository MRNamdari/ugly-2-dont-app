"use client";
import IconButton from "@/app/_components/icon-button";
import TaskTicket from "@/app/_components/task.ticket";
import { store } from "@/app/_store/state";

const tasks = store.tasks;

export default function TaskBrowserPage() {
  // const [tasks, setTasks] = useState<ITask[]>([]);
  // useSignalEffect(() => {
  //   console.log("taskSignal Updated");
  //   if (tasks.length == 0) setTasks(tasksSignal.value);
  // });
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] p-4  justify-center items-center">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
          ></IconButton>
        </div>
        <h1 className="text-3xl text-center self-end font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          Tasks
        </h1>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="Sliders"
          ></IconButton>
        </div>
      </header>
      <section className="grid grid-flow-row gap-4 p-4 h-full overflow-auto">
        {tasks.value.map((t, i) => (
          <TaskTicket key={i} {...t} />
        ))}
      </section>
    </>
  );
}
