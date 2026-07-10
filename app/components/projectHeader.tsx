import Image from "next/image";
import Link from "next/link";
import type { KeyboardEvent } from "react";

import type { Project } from "../services/projectServices";
import Button from "./button";

type ProjectHeaderProps = {
  isEditingProjectTitle: boolean;
  isLoadingProject: boolean;
  isSavingProjectTitle: boolean;
  onOpenCreateAiTask: () => void;
  onOpenCreateTask: () => void;
  onProjectTitleChange: (title: string) => void;
  onSaveProjectTitle: () => void;
  onStartProjectTitleEdition: () => void;
  project: Project | null;
  projectError: string;
  projectTitle: string;
};

export default function ProjectHeader({
  isEditingProjectTitle,
  isLoadingProject,
  isSavingProjectTitle,
  onOpenCreateAiTask,
  onOpenCreateTask,
  onProjectTitleChange,
  onSaveProjectTitle,
  onStartProjectTitleEdition,
  project,
  projectError,
  projectTitle,
}: ProjectHeaderProps) {
  function handleTitleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSaveProjectTitle();
    }
  }

  return (
    <header className="flex items-start justify-between gap-8 max-[760px]:flex-col max-[760px]:gap-5">
      <div className="flex min-w-0 flex-1 items-start gap-[15px] max-[520px]:w-full max-[520px]:gap-3">
        <Link
          href="/main/projects"
          aria-label="Retour aux projets"
          className="mt-0 flex h-[55px] w-[55px] flex-none items-center justify-center rounded-lg border border-[var(--color-line)] bg-white max-[520px]:h-11 max-[520px]:w-11"
        >
          <Image
            src="/img/back-arrow.svg"
            alt=""
            width={14}
            height={11}
            className="block h-[11px] w-[14px]"
          />
        </Link>
        <div className="min-w-0 pt-1">
          <div className="flex flex-wrap items-baseline gap-x-[17px] gap-y-2">
            {/* garde le titre contrôlé par la page pour centraliser la sauvegarde */}
            {isEditingProjectTitle ? (
              <input
                type="text"
                aria-label="Titre du projet"
                value={projectTitle}
                disabled={isSavingProjectTitle}
                onChange={(event) => onProjectTitleChange(event.target.value)}
                onKeyDown={handleTitleKeyDown}
                className="h-[38px] min-w-[260px] rounded border border-[var(--color-field-line)] bg-white px-3 text-[25px] font-semibold leading-tight text-[var(--color-heading)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)] max-[520px]:min-w-0 max-[520px]:w-full"
              />
            ) : (
              <h1 className="break-words text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
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
                  ? onSaveProjectTitle
                  : onStartProjectTitleEdition
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
          <p className="mt-[15px] max-w-[760px] text-xl leading-tight text-[var(--color-muted)] max-[520px]:text-base">
            {project?.description ?? "Aucune description"}
          </p>
        </div>
      </div>

      {/* regroupe les actions principales du projet dans le header */}
      <div className="mt-[18px] flex flex-none items-center gap-3 max-[760px]:mt-0 max-[520px]:w-full max-[520px]:flex-col">
        <Button
          type="button"
          className="whitespace-nowrap px-[18px] max-[520px]:w-full"
          onClick={onOpenCreateTask}
        >
          Créer une tâche
        </Button>
        <Button
          type="button"
          className="gap-3 whitespace-nowrap bg-[var(--color-brand)] px-[24px] hover:!bg-[var(--color-brand)] max-[520px]:w-full"
          onClick={onOpenCreateAiTask}
        >
          <Image
            src="/img/IA-icon-white.svg"
            alt=""
            width={17}
            height={17}
            className="block h-[17px] w-[17px]"
          />
          IA
        </Button>
      </div>
    </header>
  );
}