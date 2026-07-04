"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import AiGeneratedTasksModal from "../../../components/aiGeneratedTasksModal";
import Button from "../../../components/button";
import CreateTaskAiModal from "../../../components/createTaskAiModal";
import CreateTaskModal from "../../../components/createTaskModal";
import EditTaskModal from "../../../components/editTaskModal";
import TextInput, { InputIcon } from "../../../components/input";
import TaskStatusBadge, {
  type TaskStatus,
} from "../../../components/taskStatusBadge";
import type {
  AiGeneratedTask,
  TaskAssigneeOption,
} from "../../../components/taskModalTypes";
import {
  createTask,
  createTaskComment,
  getProjectTasks,
  type DashboardTaskStatus,
  type ProjectTask,
} from "../../../services/dashboardServices";
import { getSavedAuthUser } from "../../../services/authServices";
import {
  getProject,
  type Project,
  updateProject,
} from "../../../services/projectServices";

type ProjectMember = {
  initials: string;
  name: string;
  role?: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  assignees: ProjectMember[];
  comments: TaskComment[];
};

type TaskComment = {
  id: string;
  content: string;
  createdAt: string | null;
  authorName: string;
  authorInitials: string;
};

type TaskView = "list" | "calendar";

type AiGeneratedTasksResponse = {
  tasks: AiGeneratedTask[];
};

type TaskCardProps = Task & {
  commenterInitials: string;
  onCommentCreated: () => Promise<void>;
  projectId: string;
};

const projectMembers: ProjectMember[] = [
  { initials: "AD", name: "Anne Dupont", role: "Propriétaire" },
  { initials: "BD", name: "Bertrand Dupont" },
  { initials: "AD", name: "Anne Dupont" },
];

const aiGeneratedTasks: AiGeneratedTask[] = [
];

// vérifie au runtime qu'une tâche ia contient les champs attendus
function isAiGeneratedTask(value: unknown): value is AiGeneratedTask {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.title === "string" &&
    typeof task.description === "string"
  );
}

// sécurise le json reçu avant de l'utiliser dans l'interface
function isAiGeneratedTasksResponse(
  value: unknown
): value is AiGeneratedTasksResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Record<string, unknown>;

  return Array.isArray(response.tasks) && response.tasks.every(isAiGeneratedTask);
}

function getApiErrorMessage(value: unknown) {
  if (!value || typeof value !== "object") {
    return "Impossible de générer les tâches.";
  }

  const response = value as Record<string, unknown>;

  return typeof response.message === "string"
    ? response.message
    : "Impossible de générer les tâches.";
}

async function requestAiGeneratedTasks(prompt: string) {
  // appelle le backend ia et vérifie que la réponse contient bien des tâches
  const response = await fetch("/api/ai/generate-tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  let data: unknown;

  try {
    data = (await response.json()) as unknown;
  } catch {
    throw new Error("Réponse invalide reçue depuis l'API.");
  }

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data));
  }

  if (!isAiGeneratedTasksResponse(data)) {
    throw new Error("La réponse de l'IA est invalide.");
  }

  return data.tasks;
}

// lit l'utilisateur sauvegardé seulement côté navigateur
function readSavedUser() {
  return getSavedAuthUser();
}

// côté serveur localStorage n'existe pas, donc l'utilisateur reste vide
function readSavedUserOnServer() {
  return null;
}

// met à jour l'affichage si la session change dans un autre onglet
function watchSavedUserChanges(onUserChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onUserChange);

  return () => window.removeEventListener("storage", onUserChange);
}

// convertit les statuts du backend vers les statuts utilisés par l'interface
const taskStatusByApiStatus: Record<DashboardTaskStatus, TaskStatus> = {
  TODO: "todo",
  IN_PROGRESS: "progress",
  DONE: "done",
};

const statusFilterOptions: {
  label: string;
  value: TaskStatus | "all";
}[] = [
  { label: "Tous", value: "all" },
  { label: "À faire", value: "todo" },
  { label: "En cours", value: "progress" },
  { label: "Terminée", value: "done" },
];

function getInitials(name: string) {
  // crée les initiales affichées dans les badges assignés
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "Non définie";
  }

  // transforme la date api en date courte lisible dans la carte
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(new Date(dueDate));
}

function formatCommentDate(createdAt: string | null) {
  if (!createdAt) {
    return "";
  }

  // affiche la date du commentaire dans un format court pour la carte
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function getCommentCreatedAt(createdAt?: string) {
  // garantit une date affichable quand le mock ou l'api ne fournit pas createdAt
  return createdAt ?? new Date().toISOString();
}

// adapte la réponse api au format simple attendu par les cartes de tâches
function toTask(task: ProjectTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: taskStatusByApiStatus[task.status],
    dueDate: task.dueDate,
    assignees:
      task.assignees?.map((assignee) => {
        const name = assignee.user.name || assignee.user.email;

        return {
          initials: getInitials(name),
          name,
        };
      }) ?? [],
    comments: task.comments.map((comment) => {
      const authorName = comment.author?.name || comment.author?.email || "Utilisateur";

      return {
        id: comment.id,
        content: comment.content ?? "",
        createdAt: getCommentCreatedAt(comment.createdAt),
        authorName,
        authorInitials: getInitials(authorName),
      };
    }),
  };
}

function MemberBadge({ initials, name, role }: ProjectMember) {
  return (
    <span className="inline-flex items-center gap-[7px]">
      <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e5e7eb] text-xs leading-none text-[var(--color-ink)]">
        {initials}
      </span>
      <span
        className={`inline-flex h-[28px] items-center rounded-full px-[15px] text-[15px] leading-none ${
          role
            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
            : "bg-[#e5e7eb] text-[var(--color-muted)]"
        }`}
      >
        {role || name}
      </span>
    </span>
  );
}

function TaskCard({
  id,
  title,
  description,
  status,
  dueDate,
  assignees,
  comments,
  commenterInitials,
  onCommentCreated,
  projectId,
}: TaskCardProps) {
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const canSendComment = commentContent.trim() !== "";

  async function handleSendComment() {
    if (!canSendComment || isSendingComment) {
      return;
    }

    try {
      setIsSendingComment(true);
      setCommentError("");

      await createTaskComment(projectId, id, {
        content: commentContent.trim(),
      });
      setCommentContent("");
      // recharge les tâches pour récupérer le commentaire avec sa date api
      await onCommentCreated();
    } catch (error) {
      console.error("Impossible d'ajouter le commentaire.", error);
      setCommentError("Impossible d'ajouter le commentaire.");
    } finally {
      setIsSendingComment(false);
    }
  }

  return (
    <article className="rounded-lg border border-[var(--color-line)] bg-white px-[39px] py-[34px]">
      <div className="grid grid-cols-[minmax(0,1fr)_56px] gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold leading-tight text-[var(--color-ink)]">
              {title}
            </h3>
            <TaskStatusBadge status={status} />
          </div>
          <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
            {description || "Aucune description"}
          </p>
        </div>
        {/* le paramètre taskId dans l'url ouvre la modale avec cette tâche */}
        <Link
          href={`?taskId=${id}`}
          aria-label="Options de la tâche"
          className="flex h-[56px] w-[56px] items-center justify-center justify-self-end rounded-lg border border-[var(--color-line)] bg-white text-sm leading-none text-[var(--color-muted)]"
        >
          ...
        </Link>
      </div>

      <div className="mt-[32px] flex flex-wrap items-center gap-x-[8px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <span>Échéance :</span>
        <InputIcon
          src="/img/input-icon-calendar.svg"
          className="h-[17px] w-[15px]"
        />
        <span className="text-[var(--color-ink)]">{formatDueDate(dueDate)}</span>
      </div>

      <div className="mt-[28px] flex flex-wrap items-center gap-x-[8px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <span>Assigné à :</span>
        {assignees.length > 0 ? (
          assignees.map((assignee) => (
            <MemberBadge
              key={assignee.name}
              initials={assignee.initials}
              name={assignee.name}
            />
          ))
        ) : (
          <span className="text-[var(--color-ink)]">Non assignée</span>
        )}
      </div>

      <div className="mt-[29px] border-t border-[var(--color-line)] pt-[25px]">
        <button
          type="button"
          aria-controls={`${id}-comments`}
          aria-expanded={areCommentsOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-5 text-left text-base leading-none text-[var(--color-ink)]"
          onClick={() => setAreCommentsOpen(!areCommentsOpen)}
        >
          <span>Commentaires ({comments.length})</span>
          <Image
            src={
              areCommentsOpen
                ? "/img/close-collapse.svg"
                : "/img/open-collapse.svg"
            }
            alt=""
            width={15}
            height={8}
            aria-hidden="true"
            className="block h-2 w-[15px] flex-none"
          />
        </button>
        {areCommentsOpen ? (
          <div id={`${id}-comments`} className="mt-[27px] space-y-[18px]">
            {/* affiche les commentaires renvoyés avec la tâche par l'api */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="grid grid-cols-[28px_minmax(0,1fr)] gap-[16px]"
                >
                  <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e5e7eb] text-xs leading-none text-[var(--color-ink)]">
                    {comment.authorInitials}
                  </span>
                  <div className="rounded-lg bg-[#f3f4f6] px-[20px] pb-[20px] pt-[18px]">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-base font-normal leading-tight text-[var(--color-ink)]">
                        {comment.authorName}
                      </p>
                      {comment.createdAt ? (
                        <span className="text-sm leading-tight text-[var(--color-muted)]">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-[18px] text-sm leading-tight text-[var(--color-ink)]">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Aucun commentaire pour cette tâche.
              </p>
            )}

            <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-[16px]">
              <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xs leading-none text-[var(--color-brand)]">
                {commenterInitials}
              </span>
              <div className="rounded-lg bg-[#f9fafb] px-[20px] py-[18px]">
                <textarea
                  aria-label="Ajouter un commentaire"
                  value={commentContent}
                  className="min-h-[92px] w-full resize-none border-0 bg-transparent p-0 text-sm leading-tight text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]"
                  placeholder="Ajouter un commentaire..."
                  disabled={isSendingComment}
                  onChange={(event) => setCommentContent(event.target.value)}
                />
              </div>
            </div>

            {commentError ? (
              <p className="text-sm text-[var(--color-error-text)]">
                {commentError}
              </p>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canSendComment || isSendingComment}
                className={`inline-flex h-[49px] w-[210px] items-center justify-center rounded-lg text-base leading-none ${
                  canSendComment
                    ? "bg-[var(--color-action)] text-white hover:bg-[var(--color-ink)]"
                    : "bg-[#e5e7eb] text-[#9ca3af]"
                }`}
                onClick={handleSendComment}
              >
                {isSendingComment ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function matchesTaskFilters(
  task: Task,
  searchText: string,
  selectedStatus: TaskStatus | "all"
) {
  const normalizedSearch = searchText.trim().toLowerCase();
  const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
  const matchesSearch =
    normalizedSearch.length === 0 ||
    [task.title, task.description ?? ""].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    );

  return matchesStatus && matchesSearch;
}

function sortTasksByDueDate(tasksToSort: Task[], direction: "asc" | "desc") {
  return [...tasksToSort].sort((firstTask, secondTask) => {
    if (!firstTask.dueDate && !secondTask.dueDate) {
      return 0;
    }

    if (!firstTask.dueDate) {
      return 1;
    }

    if (!secondTask.dueDate) {
      return -1;
    }

    const firstDateTime = new Date(firstTask.dueDate).getTime();
    const secondDateTime = new Date(secondTask.dueDate).getTime();

    return direction === "asc"
      ? firstDateTime - secondDateTime
      : secondDateTime - firstDateTime;
  });
}

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateTaskAiModalOpen, setIsCreateTaskAiModalOpen] = useState(false);
  const [isAiGeneratedTasksModalOpen, setIsAiGeneratedTasksModalOpen] =
    useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<AiGeneratedTask[]>(
    aiGeneratedTasks
  );
  const [isGeneratingTasksWithAi, setIsGeneratingTasksWithAi] = useState(false);
  const [isAddingGeneratedTasks, setIsAddingGeneratedTasks] = useState(false);
  const [aiGenerationError, setAiGenerationError] = useState("");
  const [addGeneratedTasksError, setAddGeneratedTasksError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all");
  const [activeTaskView, setActiveTaskView] = useState<TaskView>("list");
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isEditingProjectTitle, setIsEditingProjectTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isSavingProjectTitle, setIsSavingProjectTitle] = useState(false);
  const [projectError, setProjectError] = useState("");
  const currentUser = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
  // stocke les tâches renvoyées par l'api au lieu d'utiliser un tableau mocké
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
  // la présence de taskId dans l'url décide directement si la modale est ouverte
  const taskToEditId = searchParams.get("taskId");
  const selectedStatusLabel =
    statusFilterOptions.find((option) => option.value === selectedStatus)?.label ??
    "Statut";
  const matchingTasks = tasks.filter((task) =>
    matchesTaskFilters(task, searchText, selectedStatus)
  );
  // en vue calendrier on garde les cartes existantes mais triées par échéance
  const filteredTasks =
    activeTaskView === "calendar"
      ? sortTasksByDueDate(matchingTasks, "asc")
      : matchingTasks;
  const taskViewButtonClass =
    "inline-flex h-[45px] min-w-[105px] cursor-pointer items-center justify-center gap-[10px] rounded-lg px-[17px] text-center text-sm leading-none text-[var(--color-brand)] outline-none transition-colors duration-150";
  const activeTaskViewButtonClass =
    "bg-[var(--color-brand-soft)]";
  const inactiveTaskViewButtonClass =
    "bg-white hover:bg-[var(--color-brand-soft)]";
  // construit l'affichage des contributeurs depuis le projet chargé par l'api
  const displayedProjectMembers: ProjectMember[] = project
    ? [
        {
          initials: getInitials(project.owner.name || project.owner.email),
          name: project.owner.name || project.owner.email,
          role: "Propriétaire",
        },
        ...project.members.map((member) => {
          const name = member.user.name || member.user.email;

          return {
            initials: getInitials(name),
            name,
          };
        }),
      ]
    : projectMembers;
  // fournit aux modales les utilisateurs disponibles dans le champ assigné à
  const taskAssigneeOptions: TaskAssigneeOption[] = project
    ? [
        {
          id: project.owner.id,
          name: project.owner.name || project.owner.email,
        },
        ...project.members.map((member) => ({
          id: member.user.id,
          name: member.user.name || member.user.email,
        })),
      ]
    : [];
  const commenterInitials = getInitials(
    currentUser?.name || currentUser?.email || "Utilisateur"
  );

  const loadProject = useCallback(async () => {
    try {
      setIsLoadingProject(true);
      setProjectError("");

      const data = await getProject(params.id);

      setProject(data.project);
      setProjectTitle(data.project.name);
    } catch (error) {
      console.error("Impossible de charger le projet.", error);
      setProjectError("Impossible de charger le projet.");
    } finally {
      setIsLoadingProject(false);
    }
  }, [params.id]);

  const loadProjectTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true);
      setTasksError("");

      const data = await getProjectTasks(params.id);

      // convertit les tâches api avant de les donner au composant d'affichage
      setTasks(data.tasks.map(toTask));
    } catch (error) {
      console.error("Impossible de charger les tâches du projet.", error);
      setTasksError("Impossible de charger les tâches du projet.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [params.id]);

  // recharge la liste quand l'id du projet dans l'url change
  useEffect(() => {
    let isCurrentRequest = true;

    async function loadCurrentProjectTasks() {
      if (!isCurrentRequest) {
        return;
      }

      await loadProjectTasks();
    }

    loadCurrentProjectTasks();

    return () => {
      // évite de modifier le state si la page change avant la réponse api
      isCurrentRequest = false;
    };
  }, [loadProjectTasks]);

  // recharge les informations du projet quand l'id dans l'url change
  useEffect(() => {
    async function loadCurrentProject() {
      await loadProject();
    }

    loadCurrentProject();
  }, [loadProject]);

  function closeEditTaskModal() {
    // retire le paramètre pour éviter de rouvrir la modale au rafraîchissement
    router.replace(pathname, { scroll: false });
  }

  function showAiGeneratedTasks() {
    setIsCreateTaskAiModalOpen(false);
    setIsAiGeneratedTasksModalOpen(true);
  }

  async function generateTasksWithAi(prompt: string) {
    // garde la génération ia dans la page pour partager le résultat entre les modales
    if (isGeneratingTasksWithAi) {
      return false;
    }

    try {
      setIsGeneratingTasksWithAi(true);
      setAiGenerationError("");
      setAddGeneratedTasksError("");

      const tasksGeneratedByAi = await requestAiGeneratedTasks(prompt);

      setGeneratedTasks(tasksGeneratedByAi);
      return true;
    } catch (error) {
      setAiGenerationError(
        error instanceof Error
          ? error.message
          : "Impossible de générer les tâches."
      );
      return false;
    } finally {
      setIsGeneratingTasksWithAi(false);
    }
  }

  async function addGeneratedTasksToProject() {
    // transforme les tâches prévisualisées en vraies tâches du projet
    if (generatedTasks.length === 0 || isAddingGeneratedTasks) {
      return;
    }

    try {
      setIsAddingGeneratedTasks(true);
      setAddGeneratedTasksError("");

      // chaque tâche validée est créée côté api avec le statut à faire
      for (const generatedTask of generatedTasks) {
        await createTask(params.id, {
          title: generatedTask.title,
          description: generatedTask.description,
          dueDate: null,
          status: "TODO",
          assigneeIds: [],
        });
      }

      await loadProjectTasks();
      setGeneratedTasks([]);
      setIsAiGeneratedTasksModalOpen(false);
    } catch (error) {
      console.error("Impossible d'ajouter les tâches générées.", error);
      setAddGeneratedTasksError("Impossible d'ajouter les tâches générées.");
    } finally {
      setIsAddingGeneratedTasks(false);
    }
  }

  function startProjectTitleEdition() {
    if (!project) {
      return;
    }

    setProjectTitle(project.name);
    setProjectError("");
    setIsEditingProjectTitle(true);
  }

  async function saveProjectTitle() {
    if (!project || projectTitle.trim().length < 2 || isSavingProjectTitle) {
      return;
    }

    try {
      setIsSavingProjectTitle(true);
      setProjectError("");

      const data = await updateProject(project.id, {
        name: projectTitle.trim(),
        description: project.description ?? "",
      });

      setProject(data.project);
      setProjectTitle(data.project.name);
      setIsEditingProjectTitle(false);
    } catch (error) {
      console.error("Impossible de modifier le titre du projet.", error);
      setProjectError("Impossible de modifier le titre du projet.");
    } finally {
      setIsSavingProjectTitle(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 pb-[95px] pt-[64px] max-[760px]:px-5 max-[760px]:pt-10">
      <header className="flex items-start justify-between gap-8 max-[760px]:flex-col">
        <div className="flex min-w-0 flex-1 items-start gap-[15px]">
          <Link
            href="/main/projects"
            aria-label="Retour aux projets"
            className="mt-0 flex h-[55px] w-[55px] flex-none items-center justify-center rounded-lg border border-[var(--color-line)] bg-white"
          >
            <Image
              src="/img/back-arrow.svg"
              alt=""
              width={14}
              height={11}
              aria-hidden="true"
              className="block h-[11px] w-[14px]"
            />
          </Link>
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-x-[17px] gap-y-2">
              {isEditingProjectTitle ? (
                <input
                  type="text"
                  aria-label="Titre du projet"
                  value={projectTitle}
                  disabled={isSavingProjectTitle}
                  onChange={(event) => setProjectTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      saveProjectTitle();
                    }
                  }}
                  className="h-[38px] min-w-[260px] rounded border border-[var(--color-field-line)] bg-white px-3 text-[25px] font-semibold leading-tight text-[var(--color-heading)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                />
              ) : (
                <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
                  {project?.name ?? "Nom du projet"}
                </h1>
              )}
              <button
                type="button"
                className="text-sm leading-none text-[var(--color-brand)] underline underline-offset-2 disabled:text-[var(--color-muted)]"
                disabled={
                  !project ||
                  isSavingProjectTitle ||
                  (isEditingProjectTitle && projectTitle.trim().length < 2)
                }
                onClick={
                  isEditingProjectTitle
                    ? saveProjectTitle
                    : startProjectTitleEdition
                }
              >
                {isEditingProjectTitle
                  ? isSavingProjectTitle
                    ? "Enregistrement..."
                    : "Enregistrer"
                  : "Modifier"}
              </button>
            </div>
            {isLoadingProject ? (
              <p className="mt-[15px] text-base leading-tight text-[var(--color-muted)]">
                Chargement du projet...
              </p>
            ) : null}
            {projectError ? (
              <p className="mt-[15px] text-base leading-tight text-[var(--color-error-text)]">
                {projectError}
              </p>
            ) : null}
            <p className="mt-[15px] max-w-[760px] text-xl leading-tight text-[var(--color-muted)]">
              {project?.description ?? "Aucune description"}
            </p>
          </div>
        </div>

        <div className="mt-[18px] flex flex-none items-center gap-3 max-[760px]:mt-0 max-[520px]:w-full max-[520px]:flex-col">
          <Button
            type="button"
            className="whitespace-nowrap px-[18px] max-[520px]:w-full"
            onClick={() => setIsCreateTaskModalOpen(true)}
          >
            Créer une tâche
          </Button>
          <Button
            type="button"
            className="gap-3 whitespace-nowrap bg-[var(--color-brand)] px-[24px] hover:!bg-[var(--color-brand)] max-[520px]:w-full"
            onClick={() => setIsCreateTaskAiModalOpen(true)}
          >
            <Image
              src="/img/IA-icon-white.svg"
              alt=""
              width={17}
              height={17}
              aria-hidden="true"
              className="block h-[17px] w-[17px]"
            />
            IA
          </Button>
        </div>
      </header>

      <section className="mt-[50px] flex min-h-[66px] items-center justify-between gap-6 rounded-lg bg-[#f3f4f6] px-8 py-5 max-[900px]:flex-col max-[900px]:items-start max-[640px]:px-5">
        <div className="flex flex-wrap items-baseline gap-[10px]">
          <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
            Contributeurs
          </h2>
          <span className="text-base leading-tight text-[var(--color-muted)]">
            {project ? `${project.members.length + 1} personnes` : "0 personne"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-[9px]">
          {displayedProjectMembers.map((member, memberIndex) => (
            <MemberBadge
              key={`${member.name}-${memberIndex}`}
              initials={member.initials}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </section>

      <section className="mt-[33px] rounded-lg border border-[var(--color-line)] bg-white px-8 py-[40px] max-[760px]:px-5">
        <div className="flex items-center justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
              Tâches
            </h2>
            <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
              Par ordre de priorité
            </p>
          </div>

          <div className="flex items-center gap-[14px] max-[900px]:flex-wrap">
            <button
              type="button"
              aria-pressed={activeTaskView === "list"}
              className={`${taskViewButtonClass} ${
                activeTaskView === "list"
                  ? activeTaskViewButtonClass
                  : inactiveTaskViewButtonClass
              }`}
              onClick={() => setActiveTaskView("list")}
            >
              <Image
                src="/img/chips-mes-taches.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="block h-4 w-4 flex-none"
              />
              Liste
            </button>
            <button
              type="button"
              aria-pressed={activeTaskView === "calendar"}
              className={`${taskViewButtonClass} ${
                activeTaskView === "calendar"
                  ? activeTaskViewButtonClass
                  : inactiveTaskViewButtonClass
              }`}
              onClick={() => setActiveTaskView("calendar")}
            >
              <InputIcon
                src="/img/input-icon-calendar-orange.png"
                className="h-[17px] w-[15px]"
              />
              Calendrier
            </button>
            <div className="relative">
              <button
                type="button"
                aria-controls="status-filter-options"
                aria-expanded={isStatusOpen}
                className="inline-flex h-[61px] min-w-[149px] cursor-pointer items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-[31px] text-sm leading-none text-[var(--color-muted)]"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
              >
                {selectedStatusLabel}
                <Image
                  src={
                    isStatusOpen
                      ? "/img/close-collapse.svg"
                      : "/img/open-collapse.svg"
                  }
                  alt=""
                  width={15}
                  height={8}
                  aria-hidden="true"
                  className="block h-2 w-[15px] flex-none"
                />
              </button>
              {isStatusOpen ? (
                <div
                  id="status-filter-options"
                  className="absolute left-0 top-[69px] z-10 w-full rounded-lg border border-[var(--color-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  {statusFilterOptions.map((statusOption) => (
                    <button
                      key={statusOption.value}
                      type="button"
                      className={`block w-full cursor-pointer px-4 py-2 text-left text-sm leading-tight hover:bg-[var(--color-surface-main)] ${
                        selectedStatus === statusOption.value
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-muted)]"
                      }`}
                      onClick={() => {
                        setSelectedStatus(statusOption.value);
                        setIsStatusOpen(false);
                      }}
                    >
                      {statusOption.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <TextInput
              iconSrc="/img/icone-recherche.svg"
              label="Rechercher une tâche"
              placeholder="Rechercher une tâche"
              type="text"
              className="h-[61px] w-[280px] max-w-none max-[640px]:w-full"
              variant="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
        </div>

        <div className="mx-auto mt-[41px] flex w-full max-w-[1215px] flex-col gap-[17px]">
          {/* affiche un retour clair pendant le chargement, en erreur ou quand la liste est vide */}
          {isLoadingTasks ? (
            <p className="text-base text-[var(--color-muted)]">
              Chargement des tâches...
            </p>
          ) : null}
          {!isLoadingTasks && tasksError ? (
            <p className="text-base text-[var(--color-error-text)]">
              {tasksError}
            </p>
          ) : null}
          {!isLoadingTasks && !tasksError && tasks.length === 0 ? (
            <p className="text-base text-[var(--color-muted)]">
              Aucune tâche pour ce projet.
            </p>
          ) : null}
          {!isLoadingTasks && !tasksError && tasks.length > 0 && filteredTasks.length === 0 ? (
            <p className="text-base text-[var(--color-muted)]">
              Aucune tâche ne correspond aux filtres.
            </p>
          ) : null}
          {!isLoadingTasks && !tasksError
            ? filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  commenterInitials={commenterInitials}
                  projectId={params.id}
                  onCommentCreated={loadProjectTasks}
                />
              ))
            : null}
        </div>
      </section>
      {isCreateTaskModalOpen ? (
        <CreateTaskModal
          assigneeOptions={taskAssigneeOptions}
          projectId={params.id}
          onCreated={loadProjectTasks}
          onClose={() => setIsCreateTaskModalOpen(false)}
        />
      ) : null}
      {isCreateTaskAiModalOpen ? (
        <CreateTaskAiModal
          generationError={aiGenerationError}
          isGeneratingTasks={isGeneratingTasksWithAi}
          onClose={() => setIsCreateTaskAiModalOpen(false)}
          onGenerateTasks={generateTasksWithAi}
          onShowResult={showAiGeneratedTasks}
        />
      ) : null}
      {isAiGeneratedTasksModalOpen ? (
        <AiGeneratedTasksModal
          addError={addGeneratedTasksError}
          generatedTasks={generatedTasks}
          generationError={aiGenerationError}
          isAddingTasks={isAddingGeneratedTasks}
          isGeneratingTasks={isGeneratingTasksWithAi}
          onAddTasks={addGeneratedTasksToProject}
          onGeneratedTasksChange={setGeneratedTasks}
          onGenerateTasks={generateTasksWithAi}
          onClose={() => setIsAiGeneratedTasksModalOpen(false)}
        />
      ) : null}
      {taskToEditId ? (
        // l'id vient de l'url, ce qui relie les trois points à la modale
        <EditTaskModal
          assigneeOptions={taskAssigneeOptions}
          projectId={params.id}
          taskId={taskToEditId}
          onClose={closeEditTaskModal}
          onSaved={loadProjectTasks}
        />
      ) : null}
    </div>
  );
}
