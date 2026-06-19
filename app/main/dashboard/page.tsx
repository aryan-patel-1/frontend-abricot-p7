"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import Button from "../../components/button";
import { type DashboardView, ViewTabs } from "../../components/chips";
import {
  ListView,
  TaskMeta,
  type TaskListTask,
} from "../../components/taskList";
import Tag from "../../components/tag";
import {
  getAssignedTasks,
  type DashboardTask,
  type DashboardTaskStatus,
} from "../../services/dashboardServices";
import { getSavedAuthUser, type AuthUser } from "../../services/authServices";

// garde la dernière valeur de localStorage pour éviter de relire le même utilisateur
let lastSavedUserText: string | null = null;
let lastSavedUser: AuthUser | null = null;

// convertit les statuts du backend vers les statuts attendus par l'interface
const taskStatusByApiStatus: Record<DashboardTaskStatus, TaskListTask["status"]> = {
  TODO: "todo",
  IN_PROGRESS: "progress",
  DONE: "done",
};

// définit les colonnes visibles du tableau kanban
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

// transforme une tâche reçue de l'api en tâche affichable par la liste
function toTask(task: DashboardTask): TaskListTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: taskStatusByApiStatus[task.status],
    projectName: task.project.name,
    dueDate: task.dueDate,
    commentsCount: task.comments.length,
  };
}

// lit la valeur brute stockée dans localStorage, seulement côté navigateur
function readSavedUserText() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("abricot_user");
}

// lit l'utilisateur sauvegardé et garde le même objet tant que le texte ne change pas
function readSavedUser() {
  const savedUserText = readSavedUserText();

  if (savedUserText === lastSavedUserText) {
    return lastSavedUser;
  }

  lastSavedUserText = savedUserText;
  lastSavedUser = getSavedAuthUser();

  return lastSavedUser;
}

// côté serveur localStorage n'existe pas, donc on garde l'utilisateur vide
function readSavedUserOnServer() {
  return null;
}

// prévient react si la session change dans un autre onglet du navigateur
function watchSavedUserChanges(onUserChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onUserChange);

  return () => window.removeEventListener("storage", onUserChange);
}

type CreateProjectModalProps = {
  onClose: () => void;
};

// affiche la modale de création de projet
function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const canCreateProject = title.trim() !== "" && description.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
      role="presentation"
    >
      <section
        aria-labelledby="create-project-title"
        aria-modal="true"
        className="relative w-full max-w-[598px] rounded-lg bg-white px-[73px] pb-[80px] pt-[82px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] max-[640px]:px-6 max-[640px]:py-16"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          onClick={onClose}
        >
          <Image
            src="/img/cross-black.png"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="block h-5 w-5"
          />
        </button>

        <h2
          id="create-project-title"
          className="mb-[42px] text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
        >
          Créer un projet
        </h2>

        <form className="flex flex-col gap-[25px]">
          <label className="flex flex-col gap-[7px]" htmlFor="project-title">
            <span className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Titre*
            </span>
            <input
              id="project-title"
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-[7px]" htmlFor="project-description">
            <span className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Description*
            </span>
            <input
              id="project-description"
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="flex flex-col gap-[7px]">
            <span className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Contributeurs
            </span>
            <button
              type="button"
              className="flex h-[53px] cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm leading-none text-[var(--color-muted)]"
            >
              <span>Choisir un ou plusieurs collaborateurs</span>
              <span
                className="h-[12px] w-[12px] rotate-45 border-b border-r border-[var(--color-ink)]"
                aria-hidden="true"
              />
            </button>
          </div>

          <Button
            type="button"
            className="mt-[31px] w-[181px]"
            disabled={!canCreateProject}
          >
            Ajouter un projet
          </Button>
        </form>
      </section>
    </div>
  );
}

// affiche le titre et l'action principale
function DashboardHeader({
  onCreateProject,
  user,
}: {
  onCreateProject: () => void;
  user: AuthUser | null;
}) {
  const userName = user?.name || user?.email || "utilisateur";

  return (
    <div className="flex items-start justify-between gap-8 max-[760px]:flex-col">
      <div>
        <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
          Tableau de bord
        </h1>
        <p className="mt-[14px] text-xl leading-tight text-[var(--color-ink)]">
          Bonjour {userName}, voici un aperçu de vos projets et tâches
        </p>
      </div>
      <Button
        type="button"
        className="mt-[7px] max-[760px]:mt-0"
        onClick={onCreateProject}
      >
        + Créer un projet
      </Button>
    </div>
  );
}

// affiche une tâche dans une colonne kanban
function KanbanTaskCard({ task }: { task: TaskListTask }) {
  return (
    <article className="min-h-[229px] rounded-lg border border-[var(--color-line)] bg-white px-6 py-[30px]">
      <div className="mb-[10px] flex items-start justify-between gap-4">
        <h3 className="text-[18px] font-semibold leading-tight text-[var(--color-ink)]">
          {task.title}
        </h3>
        <Tag className="flex-none" status={task.status} />
      </div>
      <p className="mb-[35px] text-[15px] leading-none text-[var(--color-muted)]">
        {task.description || "Aucune description"}
      </p>
      <TaskMeta
        commentsCount={task.commentsCount}
        dueDate={task.dueDate}
        projectName={task.projectName}
      />
      <Link
        href="/main/projects/1"
        className="mt-[33px] inline-flex h-[50px] w-[121px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--color-action)] px-7 text-base font-normal leading-none text-white no-underline transition-[background-color,transform] duration-150 hover:bg-[var(--color-ink)] active:translate-y-px"
      >
        Voir
      </Link>
    </article>
  );
}

// affiche les tâches sous forme de colonnes par statut
function KanbanView({ tasks }: { tasks: TaskListTask[] }) {
  return (
    <section className="mt-[51px] grid grid-cols-3 items-start gap-[18px] max-[900px]:grid-cols-1">
      {kanbanColumns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <article
            key={column.status}
            className="min-w-0 rounded-lg border border-[var(--color-error-border)] bg-white px-5 py-[43px]"
          >
            <div className="mb-[41px] flex items-center gap-[12px]">
              <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
                {column.title}
              </h2>
              <span className="inline-flex h-[25px] min-w-[41px] items-center justify-center rounded-full bg-[var(--color-line)] px-3 text-sm leading-none text-[var(--color-muted)]">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-4">
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

// assemble les parties principales de la page
export default function DashboardPage() {
  // garde la vue choisie pour savoir quel affichage montrer
  const [activeView, setActiveView] = useState<DashboardView>("list");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  // évite l'erreur d'hydratation puis lit l'utilisateur stocké dans le navigateur
  const user = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
  const [tasks, setTasks] = useState<TaskListTask[]>([]);

  useEffect(() => {
    // charge les tâches assignées
    async function loadTasks() {
      const data = await getAssignedTasks();
      setTasks(data.tasks.map(toTask));
    }

    loadTasks();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1408px] px-4 pb-[57px] pt-[64px] max-[760px]:px-5 max-[760px]:pt-12">
      <DashboardHeader
        user={user}
        onCreateProject={() => setIsCreateProjectModalOpen(true)}
      />
      <div className="mt-[60px]">
        <ViewTabs activeView={activeView} onViewChange={setActiveView} />
      </div>
      {/* change le composant affiché selon l'onglet sélectionné */}
      {activeView === "list" ? (
        <ListView tasks={tasks} />
      ) : (
        <KanbanView tasks={tasks} />
      )}
      {isCreateProjectModalOpen ? (
        <CreateProjectModal onClose={() => setIsCreateProjectModalOpen(false)} />
      ) : null}
    </div>
  );
}
