"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import CreateProjectModal from "../../components/createProjectModal";
import { type DashboardView, ViewTabs } from "../../components/chips";
import { DashboardHeader, KanbanView } from "../../components/dashboardViews";
import {
  ListView,
  type TaskListTask,
} from "../../components/taskList";
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

// transforme une tâche reçue de l'api en tâche affichable par la liste
function toTask(task: DashboardTask): TaskListTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: taskStatusByApiStatus[task.status],
    projectId: task.project.id,
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

// assemble les parties principales de la page
export default function DashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>("list");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskListTask[]>([]);
  const user = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );

  useEffect(() => {
    async function loadTasks() {
      const data = await getAssignedTasks();
      setTasks(data.tasks.map(toTask));
    }

    loadTasks();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1408px] px-4 pb-[57px] pt-[64px] max-[900px]:px-5 max-[900px]:pt-10 max-[520px]:pb-10">
      <DashboardHeader
        user={user}
        onCreateProject={() => setIsCreateProjectModalOpen(true)}
      />
      <div className="mt-[60px]">
        <ViewTabs activeView={activeView} onViewChange={setActiveView} />
      </div>
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
