"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import Button from "../../components/button";
import { type DashboardView, ViewTabs } from "../../components/chips";
import { ListView, type TaskListTask } from "../../components/taskList";
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
  CANCELLED: "cancelled",
};

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

// affiche le titre et l'action principale
function DashboardHeader({ user }: { user: AuthUser | null }) {
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
      >
        + Créer un projet
      </Button>
    </div>
  );
}

// affiche l'espace prévu pour la vue kanban
function KanbanView() {
  return (
    <section className="mt-[30px] rounded-lg border border-[var(--color-line)] bg-white px-[59px] py-[39px] text-xl font-semibold text-[var(--color-heading)] max-[760px]:px-5">
      Vue Kanban
    </section>
  );
}

// assemble les parties principales de la page
export default function DashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>("list");
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
    <div className="mx-auto w-full max-w-[1300px] px-[30px] pb-[57px] pt-[94px] max-[760px]:px-5 max-[760px]:pt-12">
      <DashboardHeader user={user} />
      <div className="mt-[60px]">
        <ViewTabs activeView={activeView} onViewChange={setActiveView} />
      </div>
      {activeView === "list" ? (
        <ListView tasks={tasks} />
      ) : (
        <KanbanView />
      )}
    </div>
  );
}
