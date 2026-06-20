"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Comment from "./comment";
import TextInput, { InputIcon } from "./input";
import Tag, { type TagStatus } from "./tag";

export type TaskListTask = {
  commentsCount: number;
  description: string | null;
  dueDate: string | null;
  id: string;
  projectId: string;
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
export function TaskMeta({
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
        <InputIcon
          src="/img/input-icon-calendar.svg"
          className="h-[17px] w-[15px]"
        />
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
        <Link
          href={`/main/projects/${task.projectId}?taskId=${task.id}`}
          className="inline-flex h-[50px] w-[121px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--color-action)] px-7 text-base font-normal leading-none text-white no-underline transition-[background-color,transform] duration-150 hover:bg-[var(--color-ink)] active:translate-y-px"
        >
          Voir
        </Link>
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

function matchesSearch(task: TaskListTask, searchText: string) {
  // prépare le texte saisi pour comparer sans tenir compte des majuscules
  const normalizedSearch = searchText.trim().toLowerCase();

  // garde toutes les tâches visibles tant que la recherche est trop courte
  if (normalizedSearch.length < 3) {
    return true;
  }

  // cherche dans les informations principales visibles sur une tâche
  return [task.title, task.description ?? "", task.projectName].some((value) =>
    value.toLowerCase().includes(normalizedSearch)
  );
}

// affiche la section des tâches
export function ListView({ tasks }: ListViewProps) {
  // garde en mémoire le texte tapé dans la barre de recherche
  const [searchText, setSearchText] = useState("");
  // recalcule la liste affichée à chaque changement de recherche
  const filteredTasks = tasks.filter((task) => matchesSearch(task, searchText));

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
        <TextInput
          iconSrc="/img/icone-recherche.svg"
          label="Rechercher une tâche"
          placeholder="Rechercher une tâche"
          type="text"
          variant="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>
      {filteredTasks.length > 0 ? (
        <TaskList tasks={filteredTasks} />
      ) : (
        <p className="text-[15px] leading-tight text-[var(--color-muted)]">
          Aucune tâche ne correspond à votre recherche
        </p>
      )}
    </section>
  );
}
