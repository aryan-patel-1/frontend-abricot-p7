"use client";

import Image from "next/image";

import AiPromptBar from "./aiPromptBar";

type CreateTaskAiModalProps = {
  generationError: string;
  isGeneratingTasks: boolean;
  onClose: () => void;
  onGenerateTasks: (prompt: string) => Promise<boolean>;
  onShowResult: () => void;
};

export default function CreateTaskAiModal({
  generationError,
  isGeneratingTasks,
  onClose,
  onGenerateTasks,
  onShowResult,
}: CreateTaskAiModalProps) {
  async function handleGenerateTasks(prompt: string) {
    // affiche la prévisualisation seulement si l'ia renvoie des tâches valides
    const wereTasksGenerated = await onGenerateTasks(prompt);

    if (wereTasksGenerated) {
      onShowResult();
    }

    return wereTasksGenerated;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
      <section
        aria-labelledby="create-task-ai-title"
        aria-modal="true"
        role="dialog"
        className="relative flex max-h-[calc(100dvh-64px)] min-h-[640px] w-full max-w-[598px] flex-col overflow-y-auto rounded-lg bg-white px-[52px] pb-[78px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-[520px] max-[640px]:px-6 max-[640px]:py-14"
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

        <h2
          id="create-task-ai-title"
          className="flex items-center gap-[10px] text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
        >
          <Image
            src="/img/IA-icon-orange.png"
            alt=""
            width={19}
            height={19}
            className="block h-[19px] w-[19px] flex-none"
          />
          Créer une tâche
        </h2>

        <div className="mt-auto">
          <AiPromptBar
            disabled={isGeneratingTasks}
            onSubmit={handleGenerateTasks}
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
    </div>
  );
}
