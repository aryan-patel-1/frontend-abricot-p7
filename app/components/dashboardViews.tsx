"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button from "./button";
import Tag from "./tag";
import { TaskMeta, type TaskListTask } from "./taskList";
import type { AuthUser } from "../services/authServices";

// ce fichier regroupe les composants d'affichage propres au tableau de bord
const kanbanColumns: {
  status: TaskListTask["status"];
  title: string;
}[] = [
  {
    status: "todo",
    title: "À faire",
  },
  {
    status: "progress",
    title: "En cours",
  },
  {
    status: "done",
    title: "Terminées",
  },
];

export function DashboardHeader({
  onCreateProject,
  user,
}: {
  onCreateProject: () => void;
  user: AuthUser | null;
}) {
  const userName = user?.name || user?.email || "utilisateur";

  return (
    <div className="flex items-start justify-between gap-8 max-[900px]:flex-col max-[900px]:gap-5">
      <div>
        <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
          Tableau de bord
        </h1>
        <p className="mt-[14px] text-xl leading-tight text-[var(--color-ink)] max-[520px]:text-base">
          Bonjour {userName}, voici un aperçu de vos projets et tâches
        </p>
      </div>
      <Button
        type="button"
        className="mt-[14px] max-[900px]:mt-0 max-[520px]:w-full"
        onClick={onCreateProject}
      >
        + Créer un projet
      </Button>
    </div>
  );
}

function KanbanTaskCard({ task }: { task: TaskListTask }) {
  return (
    <article className="min-h-[229px] rounded-lg border border-[var(--color-field-line)] bg-white px-6 py-[30px] max-[520px]:px-5">
      <div className="mb-[10px] flex items-start justify-between gap-4">
        <h3 className="text-[18px] font-semibold leading-tight text-[var(--color-ink)]">
          {task.title}
        </h3>
        <Tag className="flex-none" status={task.status} />
      </div>
      <p className="mb-[35px] text-[15px] leading-tight text-[var(--color-muted)]">
        {task.description || "Aucune description"}
      </p>
      <TaskMeta
        commentsCount={task.commentsCount}
        dueDate={task.dueDate}
        projectName={task.projectName}
      />
      <Link
        href={`/main/projects/${task.projectId}?taskId=${task.id}`}
        className="mt-[33px] inline-flex h-[50px] w-[121px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--color-action)] px-7 text-base font-normal leading-none text-white no-underline transition-[background-color,transform] duration-150 hover:bg-[var(--color-ink)] active:translate-y-px"
      >
        Voir
      </Link>
    </article>
  );
}

export function KanbanView({ tasks }: { tasks: TaskListTask[] }) {
  const [openColumns, setOpenColumns] = useState<
    Record<TaskListTask["status"], boolean>
  >({
    todo: true,
    progress: true,
    done: true,
  });

  function toggleColumn(status: TaskListTask["status"]) {
    setOpenColumns((currentOpenColumns) => ({
      ...currentOpenColumns,
      [status]: !currentOpenColumns[status],
    }));
  }

  return (
    <section className="mt-[51px] grid grid-cols-3 items-start gap-[18px] max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
      {kanbanColumns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);
        const isColumnOpen = openColumns[column.status];

        return (
          <article
            key={column.status}
            className="min-w-0 rounded-lg border border-[var(--color-error-border)] bg-white px-5 py-[43px] max-[700px]:py-5"
          >
            <div className="mb-[41px] flex items-center gap-[12px] max-[700px]:hidden">
              <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
                {column.title}
              </h2>
              <span className="inline-flex h-[25px] min-w-[41px] items-center justify-center rounded-full bg-[var(--color-line)] px-3 text-sm leading-none text-[var(--color-muted)]">
                {columnTasks.length}
              </span>
            </div>

            <button
              type="button"
              className="mb-0 hidden w-full cursor-pointer items-center justify-between gap-4 text-left max-[700px]:flex"
              aria-expanded={isColumnOpen}
              onClick={() => toggleColumn(column.status)}
            >
              <span className="flex items-center gap-[12px]">
                <span className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
                  {column.title}
                </span>
                <span className="inline-flex h-[25px] min-w-[41px] items-center justify-center rounded-full bg-[var(--color-line)] px-3 text-sm leading-none text-[var(--color-muted)]">
                  {columnTasks.length}
                </span>
              </span>
              <Image
                src={
                  isColumnOpen
                    ? "/img/close-collapse.svg"
                    : "/img/open-collapse.svg"
                }
                alt=""
                width={17}
                height={10}
                className="block h-[10px] w-[17px] flex-none"
              />
            </button>

            <div
              className={`space-y-4 max-[700px]:mt-6 ${
                isColumnOpen ? "block" : "hidden"
              } min-[701px]:block`}
            >
              {columnTasks.map((task) => (
                <KanbanTaskCard key={task.id} task={task} />
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
