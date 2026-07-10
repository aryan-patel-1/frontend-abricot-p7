"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";

import Button from "./button";
import { editableStatuses, type TaskAssigneeOption } from "./taskModalTypes";
import TaskStatusBadge from "./taskStatusBadge";
import {
  getTask,
  updateTask,
  type DashboardTaskStatus,
} from "../services/dashboardServices";

type EditTaskModalProps = {
  assigneeOptions: TaskAssigneeOption[];
  onSaved: () => Promise<void>;
  onClose: () => void;
  projectId: string;
  taskId: string;
};

function formatDateInputValue(dueDate: string | null) {
  // l'input date attend une valeur au format yyyy-mm-dd
  if (!dueDate) {
    return "";
  }

  return dueDate.slice(0, 10);
}

export default function EditTaskModal({
  assigneeOptions,
  onClose,
  onSaved,
  projectId,
  taskId,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [areAssigneesOpen, setAreAssigneesOpen] = useState(false);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [status, setStatus] = useState<DashboardTaskStatus>("TODO");
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const selectedAssignees = assigneeOptions.filter((assigneeOption) =>
    assigneeIds.includes(assigneeOption.id)
  );
  const selectedAssigneesLabel =
    selectedAssignees.length > 0
      ? selectedAssignees.map((assigneeOption) => assigneeOption.name).join(", ")
      : "Choisir un ou plusieurs collaborateurs";

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadTask() {
      try {
        setIsLoadingTask(true);
        setErrorMessage("");

        // charge la tâche pour préremplir les champs de la modale
        const data = await getTask(projectId, taskId);

        if (isCurrentRequest) {
          const assignees = data.task.assignees ?? [];

          setTitle(data.task.title);
          setDescription(data.task.description ?? "");
          setDueDate(formatDateInputValue(data.task.dueDate));
          setStatus(data.task.status);
          setAssigneeIds(assignees.map((taskAssignee) => taskAssignee.user.id));
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
      // ignore la réponse si l'utilisateur ferme la modale pendant le chargement
      isCurrentRequest = false;
    };
  }, [projectId, taskId]);

  function toggleAssignee(assigneeId: string) {
    // ajoute ou retire un collaborateur sans perdre les autres sélections
    setAssigneeIds((currentAssigneeIds) =>
      currentAssigneeIds.includes(assigneeId)
        ? currentAssigneeIds.filter((currentAssigneeId) => currentAssigneeId !== assigneeId)
        : [...currentAssigneeIds, assigneeId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSavingTask(true);
      setErrorMessage("");

      // envoie les champs modifiés sans fermer la modale en cas d'erreur
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
        className="relative max-h-[calc(100dvh-64px)] w-full max-w-[598px] overflow-y-auto rounded-lg bg-white px-[73px] pb-[77px] pt-[81px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:px-6 max-[640px]:py-14"
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

          <div className="relative mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Assigné à
            </p>
            <button
              type="button"
              aria-controls="edit-task-assignees"
              aria-expanded={areAssigneesOpen}
              className="mt-[7px] flex h-[53px] w-full cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm text-[var(--color-muted)]"
              disabled={isLoadingTask || isSavingTask}
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
                className="block h-2 w-[15px] flex-none"
              />
            </button>
            {areAssigneesOpen ? (
              <div
                id="edit-task-assignees"
                className="absolute left-0 right-0 top-[82px] z-10 max-h-[190px] overflow-y-auto rounded border border-[var(--color-field-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                {assigneeOptions.map((assigneeOption) => (
                  <label
                    key={assigneeOption.id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-main)]"
                  >
                    <input
                      type="checkbox"
                      checked={assigneeIds.includes(assigneeOption.id)}
                      disabled={isLoadingTask || isSavingTask}
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
            className="mt-[56px] w-[244px] max-[520px]:w-full"
          >
            {isSavingTask ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </section>
    </div>
  );
}
