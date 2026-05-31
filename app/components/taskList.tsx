import Image from "next/image";

import Button from "./button";
import Comment from "./comment";
import IconButton from "./iconButton";
import { InputCalendarIcon } from "./input";
import Tag, { type TagStatus } from "./tag";

export type TaskListTask = {
  commentsCount: number;
  description: string | null;
  dueDate: string | null;
  id: string;
  projectName: string;
  status: TagStatus;
  title: string;
};

type TaskListProps = {
  tasks: TaskListTask[];
};

function ProjectIcon() {
  return (
    <Image
      src="/img/menu-gris-tache-liste.svg"
      alt=""
      width={18}
      height={14}
      aria-hidden="true"
      className="block h-[14px] w-[18px] flex-none"
    />
  );
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "Pas de date";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(new Date(dueDate));
}

// affiche les informations secondaires d'une tâche
function TaskMeta({
  commentsCount,
  dueDate,
  projectName,
}: {
  commentsCount: number;
  dueDate: string | null;
  projectName: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-[13px] gap-y-2 text-[13px] leading-none text-[var(--color-muted)]">
      <span className="inline-flex items-center gap-[7px]">
        <ProjectIcon />
        <span>{projectName}</span>
      </span>
      <span className="h-[17px] w-px bg-[var(--color-divider)]" aria-hidden="true" />
      <span className="inline-flex items-center gap-[7px]">
        <InputCalendarIcon className="h-[17px] w-[15px]" />
        <span>{formatDueDate(dueDate)}</span>
      </span>
      <span className="h-[17px] w-px bg-[var(--color-divider)]" aria-hidden="true" />
      <span className="inline-flex items-center gap-[7px]">
        <Comment className="h-[15px] w-[15px]" />
        <span>{commentsCount}</span>
      </span>
    </div>
  );
}

// affiche une tâche de la liste
function TaskCard({ task }: { task: TaskListTask }) {
  return (
    <article className="grid min-h-[162px] grid-cols-[minmax(0,1fr)_160px] items-center gap-6 rounded-lg border border-[var(--color-line)] bg-white px-[39px] py-[24px] max-[700px]:grid-cols-1">
      <div>
        <h3 className="mb-[10px] text-[18px] font-semibold leading-tight text-[var(--color-ink)]">
          {task.title}
        </h3>
        <p className="mb-[35px] text-[15px] leading-none text-[var(--color-muted)]">
          {task.description || "Aucune description"}
        </p>
        <TaskMeta
          commentsCount={task.commentsCount}
          dueDate={task.dueDate}
          projectName={task.projectName}
        />
      </div>
      <div className="flex h-full flex-col items-end justify-between gap-6 max-[700px]:h-auto max-[700px]:items-start">
        <Tag status={task.status} />
        <Button type="button" className="w-[121px]">
          Voir
        </Button>
      </div>
    </article>
  );
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-[17px]">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

type ListViewProps = {
  tasks: TaskListTask[];
};

// affiche la section des tâches
export function ListView({ tasks }: ListViewProps) {
  return (
    <section className="mt-[30px] rounded-lg border border-[var(--color-line)] bg-white px-[59px] py-[39px] max-[760px]:px-5">
      <div className="mb-[41px] flex items-center justify-between gap-8 max-[760px]:flex-col max-[760px]:items-start">
        <div>
          <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
            Mes tâches assignées
          </h2>
          <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
            Par ordre de priorité
          </p>
        </div>
        <label className="flex h-[63px] w-full max-w-[357px] items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-[31px] text-[15px] text-[var(--color-muted)]">
          <span className="sr-only">Rechercher une tâche</span>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] leading-none text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
            placeholder="Rechercher une tâche"
            readOnly
          />
          <IconButton className="h-[14px] w-[14px]" />
        </label>
      </div>
      <TaskList tasks={tasks} />
    </section>
  );
}
