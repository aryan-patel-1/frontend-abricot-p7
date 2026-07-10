"use client";

import Image from "next/image";

import type { AuthUser } from "../services/authServices";
import type { Project } from "../services/projectServices";
import Button from "./button";

// ce composant affiche la modale utilisée pour créer ou modifier un projet
type ProjectFormModalProps = {
  canDeleteProject?: boolean;
  canSubmit: boolean;
  contributors: AuthUser[];
  contributorsError: string;
  description: string;
  error: string;
  isContributorsOpen: boolean;
  isDeleting?: boolean;
  isSubmitting: boolean;
  mode: "create" | "edit";
  project?: Project;
  selectedContributorIds: string[];
  submitLabel: string;
  submittingLabel: string;
  title: string;
  onClose: () => void;
  onContributorsOpenChange: (isOpen: boolean) => void;
  onDelete?: () => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  onTitleChange: (title: string) => void;
  onToggleContributor: (contributorId: string) => void;
};

export default function ProjectFormModal({
  canDeleteProject = false,
  canSubmit,
  contributors,
  contributorsError,
  description,
  error,
  isContributorsOpen,
  isDeleting = false,
  isSubmitting,
  mode,
  project,
  selectedContributorIds,
  submitLabel,
  submittingLabel,
  title,
  onClose,
  onContributorsOpenChange,
  onDelete,
  onDescriptionChange,
  onSubmit,
  onTitleChange,
  onToggleContributor,
}: ProjectFormModalProps) {
  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Modifier un projet" : "Créer un projet";
  const titleId = isEditMode ? "edit-project-title" : "create-project-title";
  const contributorsLabel =
    selectedContributorIds.length === 0
      ? "Choisir un ou plusieurs collaborateurs"
      : contributors
          .filter((contributor) => selectedContributorIds.includes(contributor.id))
          .map((contributor) => contributor.name || contributor.email)
          .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby={titleId}
        className="relative max-h-[calc(100dvh-64px)] min-h-[616px] w-full max-w-[598px] overflow-y-auto rounded-lg bg-white px-[73px] pb-[79px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-0 max-[640px]:px-6 max-[640px]:py-14"
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

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="flex flex-col"
        >
          <h2
            id={titleId}
            className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
          >
            {modalTitle}
          </h2>

          <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Titre*
            <input
              type="text"
              value={title}
              disabled={isSubmitting}
              onChange={(event) => onTitleChange(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Description*
            <input
              type="text"
              value={description}
              disabled={isSubmitting}
              onChange={(event) => onDescriptionChange(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <div className="relative mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Contributeurs
            </p>
            <button
              type="button"
              className="mt-[7px] flex h-[53px] w-full cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm text-[var(--color-muted)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
              onClick={() => onContributorsOpenChange(!isContributorsOpen)}
            >
              <span className="truncate">{contributorsLabel}</span>
              <span className="ml-4 h-3 w-3 rotate-45 border-b border-r border-[var(--color-ink)]" />
            </button>

            {isContributorsOpen ? (
              <div className="absolute left-0 right-0 top-[82px] z-10 max-h-[220px] overflow-y-auto rounded border border-[var(--color-field-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {contributors.map((contributor) => (
                  <label
                    key={contributor.id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-main)]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContributorIds.includes(contributor.id)}
                      disabled={isSubmitting}
                      onChange={() => onToggleContributor(contributor.id)}
                      className="h-4 w-4 accent-[var(--color-brand)]"
                    />
                    {contributor.name || contributor.email}
                  </label>
                ))}
                {contributors.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-[var(--color-muted)]">
                    Aucun contributeur disponible
                  </p>
                ) : null}
              </div>
            ) : null}
            {contributorsError ? (
              <p className="mt-2 text-xs text-[var(--color-error)]">
                {contributorsError}
              </p>
            ) : null}
          </div>

          {error ? (
            <p className="mt-6 text-sm text-[var(--color-error)]">{error}</p>
          ) : null}

          <div className="mt-[56px] flex flex-wrap gap-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className={
                isEditMode
                  ? "w-[181px] max-[520px]:w-full"
                  : "w-[181px] bg-[#e5e7eb] text-[var(--color-muted)] hover:bg-[#e5e7eb] disabled:opacity-100 max-[520px]:w-full"
              }
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
            {project?.userRole === "ADMIN" && onDelete ? (
              <button
                type="button"
                disabled={!canDeleteProject}
                onClick={onDelete}
                className="inline-flex min-h-[50px] w-[181px] cursor-pointer items-center justify-center rounded-lg border border-[#ffccc7] bg-white px-7 py-3 text-center text-base font-normal leading-tight text-[#9f1d12] transition-[background-color,transform] duration-150 hover:bg-[#fff1f0] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-[0.68] max-[520px]:w-full"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
