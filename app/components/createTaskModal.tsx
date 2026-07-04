"use client";

import Image from "next/image";
import { type FormEvent, useRef, useState } from "react";

import Button from "./button";
import { InputIcon } from "./input";
import { editableStatuses, type TaskAssigneeOption } from "./taskModalTypes";
import TaskStatusBadge from "./taskStatusBadge";
import {
  createTask,
  type DashboardTaskStatus,
} from "../services/dashboardServices";

type CreateTaskModalProps = {
  assigneeOptions: TaskAssigneeOption[];
  onCreated: () => Promise<void>;
  onClose: () => void;
  projectId: string;
};

export default function CreateTaskModal({
  assigneeOptions,
  onCreated,
  onClose,
  projectId,
}: CreateTaskModalProps) {
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
    // ouvre le sélecteur natif quand l'icône calendrier est cliquée
    dueDateInputRef.current?.showPicker?.();
    dueDateInputRef.current?.focus();
  }

  function toggleAssignee(assigneeId: string) {
    // ajoute ou retire un collaborateur sans perdre les autres sélections
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

      // crée la tâche puis recharge la liste dans la page parent
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
