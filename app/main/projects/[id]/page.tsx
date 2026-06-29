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
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import Button from "../../../components/button";
import TextInput, { InputIcon } from "../../../components/input";
import {
  createTask,
  createTaskComment,
  getTask,
  getProjectTasks,
  type DashboardTaskStatus,
  type ProjectTask,
  updateTask,
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

type TaskStatus = "todo" | "progress" | "done";

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

type TaskAssigneeOption = {
  id: string;
  name: string;
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

const statusStyles: Record<
  TaskStatus,
  {
    label: string;
    className: string;
  }
> = {
  todo: {
    label: "À faire",
    className: "bg-[var(--color-todo-bg)] text-[var(--color-todo-text)]",
  },
  progress: {
    label: "En cours",
    className: "bg-[var(--color-progress-bg)] text-[var(--color-progress-text)]",
  },
  done: {
    label: "Terminée",
    className: "bg-[var(--color-done-bg)] text-[var(--color-done-text)]",
  },
};

// convertit les statuts du backend vers les statuts utilisés par l'interface
const taskStatusByApiStatus: Record<DashboardTaskStatus, TaskStatus> = {
  TODO: "todo",
  IN_PROGRESS: "progress",
  DONE: "done",
};

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
        createdAt: comment.createdAt ?? null,
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

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const statusStyle = statusStyles[status];

  return (
    <span
      className={`inline-flex h-[28px] items-center rounded-full px-4 text-[15px] leading-none ${statusStyle.className}`}
    >
      {statusStyle.label}
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
        <button
          type="button"
          aria-label="Options de la tâche"
          className="flex h-[56px] w-[56px] items-center justify-center justify-self-end rounded-lg border border-[var(--color-line)] bg-white text-sm leading-none text-[var(--color-muted)]"
        >
          ...
        </button>
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

function CreateTaskModal({
  assigneeOptions,
  onCreated,
  onClose,
  projectId,
}: {
  assigneeOptions: TaskAssigneeOption[];
  onCreated: () => Promise<void>;
  onClose: () => void;
  projectId: string;
}) {
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [areAssigneesOpen, setAreAssigneesOpen] = useState(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [status, setStatus] = useState<DashboardTaskStatus>("TODO");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const selectedAssignees = assigneeOptions.filter((assigneeOption) =>
    selectedAssigneeIds.includes(assigneeOption.id)
  );
  const canCreateTask =
    title.trim().length >= 2 && description.trim() !== "" && dueDate !== "";
  const selectedAssigneesLabel =
    selectedAssignees.length > 0
      ? selectedAssignees.map((assigneeOption) => assigneeOption.name).join(", ")
      : "Choisir un ou plusieurs collaborateurs";

  function openDueDatePicker() {
    dueDateInputRef.current?.showPicker?.();
    dueDateInputRef.current?.focus();
  }

  function toggleAssignee(assigneeId: string) {
    setSelectedAssigneeIds((currentAssigneeIds) =>
      currentAssigneeIds.includes(assigneeId)
        ? currentAssigneeIds.filter((currentAssigneeId) => currentAssigneeId !== assigneeId)
        : [...currentAssigneeIds, assigneeId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateTask || isCreatingTask) {
      return;
    }

    try {
      setIsCreatingTask(true);
      setErrorMessage("");

      await createTask(projectId, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        status,
        assigneeIds: selectedAssigneeIds,
      });
      await onCreated();
      onClose();
    } catch (error) {
      console.error("Impossible de créer la tâche.", error);
      setErrorMessage("Impossible de créer la tâche.");
    } finally {
      setIsCreatingTask(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
      <section
        aria-labelledby="create-task-title"
        aria-modal="true"
        role="dialog"
        className="relative w-full max-w-[598px] rounded-lg bg-white px-[73px] pb-[78px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:px-6 max-[640px]:py-14"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
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

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h2
            id="create-task-title"
            className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
          >
            Créer une tâche
          </h2>

          <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Titre*
            <input
              type="text"
              value={title}
              disabled={isCreatingTask}
              onChange={(event) => setTitle(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Description*
            <input
              type="text"
              value={description}
              disabled={isCreatingTask}
              onChange={(event) => setDescription(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Échéance*
            <span className="flex h-[53px] items-center rounded border border-[var(--color-field-line)] bg-white px-3.5">
              <input
                ref={dueDateInputRef}
                type="date"
                value={dueDate}
                disabled={isCreatingTask}
                onChange={(event) => setDueDate(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-[var(--color-ink)] outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <button
                type="button"
                aria-label="Ouvrir le calendrier"
                className="flex h-8 w-8 items-center justify-center"
                disabled={isCreatingTask}
                onClick={openDueDatePicker}
              >
                <InputIcon
                  src="/img/input-icon-calendar.svg"
                  className="h-[17px] w-[15px]"
                />
              </button>
            </span>
          </label>

          <div className="relative mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Assigné à :
            </p>
            <button
              type="button"
              aria-controls="create-task-assignees"
              aria-expanded={areAssigneesOpen}
              className="mt-[7px] flex h-[53px] w-full cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm text-[var(--color-muted)]"
              disabled={isCreatingTask}
              onClick={() => setAreAssigneesOpen(!areAssigneesOpen)}
            >
              <span className="truncate">{selectedAssigneesLabel}</span>
              <Image
                src={
                  areAssigneesOpen
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
            {areAssigneesOpen ? (
              <div
                id="create-task-assignees"
                className="absolute left-0 right-0 top-[82px] z-10 max-h-[190px] overflow-y-auto rounded border border-[var(--color-field-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                {assigneeOptions.map((assigneeOption) => (
                  <label
                    key={assigneeOption.id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-main)]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAssigneeIds.includes(assigneeOption.id)}
                      disabled={isCreatingTask}
                      onChange={() => toggleAssignee(assigneeOption.id)}
                      className="h-4 w-4 accent-[var(--color-brand)]"
                    />
                    <span>{assigneeOption.name}</span>
                  </label>
                ))}
                {assigneeOptions.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-[var(--color-muted)]">
                    Aucun collaborateur disponible
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Statut :
            </p>
            <div className="mt-[16px] flex flex-wrap gap-3">
              {editableStatuses.map((statusOption) => (
                <button
                  key={statusOption.value}
                  type="button"
                  aria-pressed={status === statusOption.value}
                  className={`rounded-full outline-offset-2 ${
                    status === statusOption.value
                      ? "outline outline-2 outline-[var(--color-brand)]"
                      : ""
                  }`}
                  disabled={isCreatingTask}
                  onClick={() => setStatus(statusOption.value)}
                >
                  <TaskStatusBadge status={statusOption.status} />
                </button>
              ))}
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-[20px] text-sm text-[var(--color-error-text)]">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={!canCreateTask || isCreatingTask}
            className={`mt-[56px] w-[201px] text-sm ${
              canCreateTask
                ? ""
                : "bg-[#e5e7eb] text-[#9CA3AF] hover:bg-[#e5e7eb] disabled:opacity-100"
            }`}
          >
            {isCreatingTask ? "Création..." : "+ Ajouter une tâche"}
          </Button>
        </form>
      </section>
    </div>
  );
}

type EditTaskModalProps = {
  onSaved: () => Promise<void>;
  onClose: () => void;
  projectId: string;
  taskId: string;
};

const editableStatuses: {
  value: "TODO" | "IN_PROGRESS" | "DONE";
  status: TaskStatus;
}[] = [
  { value: "TODO", status: "todo" },
  { value: "IN_PROGRESS", status: "progress" },
  { value: "DONE", status: "done" },
];

const statusFilterOptions: {
  label: string;
  value: TaskStatus | "all";
}[] = [
  { label: "Tous", value: "all" },
  { label: "À faire", value: "todo" },
  { label: "En cours", value: "progress" },
  { label: "Terminée", value: "done" },
];

function formatDateInputValue(dueDate: string | null) {
  if (!dueDate) {
    return "";
  }

  return dueDate.slice(0, 10);
}

// affiche un formulaire de modification prérempli avec les données api
function EditTaskModal({ onClose, onSaved, projectId, taskId }: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadTask() {
      try {
        setIsLoadingTask(true);
        setErrorMessage("");

        const data = await getTask(projectId, taskId);

        if (isCurrentRequest) {
          const assignees = data.task.assignees ?? [];

          setTitle(data.task.title);
          setDescription(data.task.description ?? "");
          setDueDate(formatDateInputValue(data.task.dueDate));
          setStatus(data.task.status);
          setAssigneeIds(assignees.map((taskAssignee) => taskAssignee.user.id));
          setAssignee(
            assignees
              .map((taskAssignee) => taskAssignee.user.name || taskAssignee.user.email)
              .join(", ")
          );
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.error("Impossible de charger la tâche à modifier.", error);
          setErrorMessage("Impossible de charger la tâche à modifier.");
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoadingTask(false);
        }
      }
    }

    loadTask();

    return () => {
      isCurrentRequest = false;
    };
  }, [projectId, taskId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSavingTask(true);
      setErrorMessage("");

      await updateTask(projectId, taskId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        status,
        assigneeIds,
      });
      await onSaved();
      onClose();
    } catch (error) {
      console.error("Impossible d'enregistrer la tâche.", error);
      setErrorMessage("Impossible d'enregistrer la tâche.");
    } finally {
      setIsSavingTask(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 px-5 py-8">
      <section
        aria-labelledby="edit-task-title"
        aria-modal="true"
        role="dialog"
        className="relative w-full max-w-[598px] rounded-lg bg-white px-[73px] pb-[77px] pt-[81px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:px-6 max-[640px]:py-14"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
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

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h2
            id="edit-task-title"
            className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
          >
            Modifier
          </h2>

          {isLoadingTask ? (
            <p className="mt-[42px] text-sm text-[var(--color-muted)]">
              Chargement de la tâche...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-[20px] text-sm text-[var(--color-error-text)]">
              {errorMessage}
            </p>
          ) : null}

          <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Titre
            <input
              type="text"
              value={title}
              disabled={isLoadingTask || isSavingTask}
              onChange={(event) => setTitle(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-4 text-sm text-[var(--color-muted)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Description
            <input
              type="text"
              value={description}
              disabled={isLoadingTask || isSavingTask}
              onChange={(event) => setDescription(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-4 text-sm text-[var(--color-muted)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Échéance
            <input
              type="date"
              value={dueDate}
              disabled={isLoadingTask || isSavingTask}
              onChange={(event) => setDueDate(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-4 text-sm text-[var(--color-muted)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Assigné à
            <input
              type="text"
              value={assignee}
              readOnly
              disabled={isLoadingTask || isSavingTask}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-4 text-sm text-[var(--color-muted)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <div className="mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Statut :
            </p>
            <div className="mt-[16px] flex flex-wrap gap-3">
              {editableStatuses.map((statusOption) => (
                <button
                  key={statusOption.value}
                  type="button"
                  aria-pressed={status === statusOption.value}
                  className={`rounded-full outline-offset-2 ${
                    status === statusOption.value
                      ? "outline outline-2 outline-[var(--color-brand)]"
                      : ""
                  }`}
                  onClick={() => setStatus(statusOption.value)}
                  disabled={isLoadingTask || isSavingTask}
                >
                  <TaskStatusBadge status={statusOption.status} />
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoadingTask || isSavingTask || title.trim().length < 2}
            className="mt-[56px] w-[244px]"
          >
            {isSavingTask ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </section>
    </div>
  );
}

function CreateTaskAiModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
      <section
        aria-labelledby="create-task-ai-title"
        aria-modal="true"
        role="dialog"
        className="relative flex min-h-[797px] w-full max-w-[598px] flex-col rounded-lg bg-white px-[52px] pb-[78px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-[640px] max-[640px]:px-6 max-[640px]:py-14"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
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
          id="create-task-ai-title"
          className="flex items-center gap-[10px] text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
        >
          <Image
            src="/img/IA-icon-orange.png"
            alt=""
            width={19}
            height={19}
            aria-hidden="true"
            className="block h-[19px] w-[19px] flex-none"
          />
          Créer une tâche
        </h2>

        <div className="mt-auto rounded-full bg-[#f9fafb] px-[32px] py-[18px]">
          <div className="flex items-center gap-4">
            <input
              type="text"
              aria-label="Décrire les tâches à ajouter"
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]"
            />
            <button
              type="button"
              aria-label="Envoyer la demande"
              className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full bg-[var(--color-brand)] text-white"
            >
              <Image
                src="/img/IA-icon-white.svg"
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
                className="block h-3 w-3"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
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
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all");
  const [isCalendarSortActive, setIsCalendarSortActive] = useState(false);
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
  const filteredTasks = sortTasksByDueDate(
    matchingTasks,
    isCalendarSortActive ? "desc" : "asc"
  );
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
              className="inline-flex h-[45px] items-center gap-[10px] rounded-lg bg-[var(--color-brand-soft)] px-[17px] text-sm leading-none text-[var(--color-brand)]"
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
              aria-pressed={isCalendarSortActive}
              className={`inline-flex h-[45px] items-center gap-[10px] rounded-lg px-[17px] text-sm leading-none text-[var(--color-brand)] ${
                isCalendarSortActive ? "bg-[var(--color-brand-soft)]" : "bg-white"
              }`}
              onClick={() => setIsCalendarSortActive(!isCalendarSortActive)}
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
        <CreateTaskAiModal onClose={() => setIsCreateTaskAiModalOpen(false)} />
      ) : null}
      {taskToEditId ? (
        <EditTaskModal
          projectId={params.id}
          taskId={taskToEditId}
          onClose={closeEditTaskModal}
          onSaved={loadProjectTasks}
        />
      ) : null}
    </div>
  );
}
