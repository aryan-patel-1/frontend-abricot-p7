"use client";

import Image from "next/image";
import { useState } from "react";

import AiPromptBar from "./aiPromptBar";
import Button from "./button";
import EditAiGeneratedTaskModal from "./editAiGeneratedTaskModal";
import type { AiGeneratedTask } from "./taskModalTypes";

type AiGeneratedTasksModalProps = {
  addError: string;
  generatedTasks: AiGeneratedTask[];
  generationError: string;
  isAddingTasks: boolean;
  isGeneratingTasks: boolean;
  onAddTasks: () => Promise<void>;
  onGeneratedTasksChange: (tasks: AiGeneratedTask[]) => void;
  onGenerateTasks: (prompt: string) => Promise<boolean>;
  onClose: () => void;
};

function AiGeneratedTaskCard({
  onDelete,
  onEdit,
  task,
}: {
  onDelete: () => void;
  onEdit: () => void;
  task: AiGeneratedTask;
}) {
  return (
    <article className="rounded-lg border border-[var(--color-line)] bg-white px-[39px] py-[26px] max-[640px]:px-5">
      <h3 className="text-xl font-semibold leading-tight text-[var(--color-ink)]">
        {task.title}
      </h3>
      <p className="mt-[9px] text-[15px] leading-tight text-[var(--color-muted)]">
        {task.description}
      </p>
      <div className="mt-[31px] flex flex-wrap items-center gap-x-[15px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <button
          type="button"
          className="inline-flex items-center gap-[7px] text-left"
          onClick={onDelete}
        >
          <Image
            src="/img/trashIcon.svg"
            alt=""
            width={16}
            height={14}
            aria-hidden="true"
            className="h-[14px] w-4 flex-none"
          />
          Supprimer
        </button>
        <span className="h-[17px] w-px bg-[var(--color-divider)]" aria-hidden="true" />
        <button
          type="button"
          className="inline-flex items-center gap-[7px] text-left"
          onClick={onEdit}
        >
          <Image
            src="/img/pencilIcon.png"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className="h-[14px] w-[14px] flex-none"
          />
          Modifier
        </button>
      </div>
    </article>
  );
}

export default function AiGeneratedTasksModal({
  addError,
  generatedTasks,
  generationError,
  isAddingTasks,
  isGeneratingTasks,
  onAddTasks,
  onGeneratedTasksChange,
  onGenerateTasks,
  onClose,
}: AiGeneratedTasksModalProps) {
  // garde une liste affichable même si la donnée reçue est vide ou remplacée
  const tasksToDisplay = Array.isArray(generatedTasks) ? generatedTasks : [];
  const [taskIndexToEdit, setTaskIndexToEdit] = useState<number | null>(null);
  // l'index permet de modifier une tâche ia sans créer une vraie tâche tout de suite
  const taskToEdit =
    taskIndexToEdit === null ? null : tasksToDisplay[taskIndexToEdit] ?? null;

  function deleteGeneratedTask(taskIndex: number) {
    // retire seulement la tâche choisie de la prévisualisation
    onGeneratedTasksChange(
      tasksToDisplay.filter((_, currentIndex) => currentIndex !== taskIndex)
    );
  }

  function updateGeneratedTask(taskIndex: number, updatedTask: AiGeneratedTask) {
    // remplace la tâche modifiée sans changer l'ordre de la liste
    onGeneratedTasksChange(
      tasksToDisplay.map((task, currentIndex) =>
        currentIndex === taskIndex ? updatedTask : task
      )
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/30 px-5 py-8">
      <section
        aria-labelledby="ai-generated-tasks-title"
        aria-modal="true"
        role="dialog"
        className="relative flex min-h-[797px] w-full max-w-[598px] flex-col rounded-lg bg-white px-[52px] pb-[39px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-[640px] max-[640px]:px-6 max-[640px]:py-14"
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
          id="ai-generated-tasks-title"
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
          Vos tâches...
        </h2>

        <div className="mt-[42px] flex flex-col gap-[24px]">
          {tasksToDisplay.map((task, taskIndex) => (
            <AiGeneratedTaskCard
              key={`${task.title}-${taskIndex}`}
              task={task}
              onDelete={() => deleteGeneratedTask(taskIndex)}
              onEdit={() => setTaskIndexToEdit(taskIndex)}
            />
          ))}
        </div>

        {tasksToDisplay.length === 0 ? (
          <p className="mt-[42px] text-sm text-[var(--color-muted)]">
            Aucune tâche générée pour le moment.
          </p>
        ) : null}

        {addError ? (
          <p className="mt-4 text-sm text-[var(--color-error-text)]">
            {addError}
          </p>
        ) : null}

        <Button
          type="button"
          className="mx-auto mt-[24px] w-[181px]"
          disabled={tasksToDisplay.length === 0 || isAddingTasks}
          onClick={onAddTasks}
        >
          {isAddingTasks ? "Ajout..." : "+ Ajouter les tâches"}
        </Button>

        <div className="mt-[23px]">
          <AiPromptBar
            disabled={isGeneratingTasks || isAddingTasks}
            onSubmit={onGenerateTasks}
          />
        </div>
        {isGeneratingTasks ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            L&apos;IA prépare les tâches...
          </p>
        ) : null}
        {generationError ? (
          <p className="mt-4 text-sm text-[var(--color-error-text)]">
            {generationError}
          </p>
        ) : null}
      </section>
      {taskToEdit ? (
        <EditAiGeneratedTaskModal
          task={taskToEdit}
          onClose={() => setTaskIndexToEdit(null)}
          onSaved={(updatedTask) =>
            updateGeneratedTask(taskIndexToEdit ?? 0, updatedTask)
          }
        />
      ) : null}
    </div>
  );
}
