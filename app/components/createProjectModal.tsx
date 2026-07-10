"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "./button";

// ce composant affiche la modale simple de création depuis le tableau de bord
type CreateProjectModalProps = {
  onClose: () => void;
};

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const canCreateProject = title.trim() !== "" && description.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
      role="presentation"
    >
      <section
        aria-labelledby="create-project-title"
        aria-modal="true"
        className="relative max-h-[calc(100dvh-64px)] w-full max-w-[598px] overflow-y-auto rounded-lg bg-white px-[73px] pb-[80px] pt-[82px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] max-[640px]:px-6 max-[640px]:py-16"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
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
          id="create-project-title"
          className="mb-[42px] text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
        >
          Créer un projet
        </h2>

        <form className="flex flex-col gap-[25px]">
          <label className="flex flex-col gap-[7px]" htmlFor="project-title">
            <span className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Titre*
            </span>
            <input
              id="project-title"
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-[7px]" htmlFor="project-description">
            <span className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Description*
            </span>
            <input
              id="project-description"
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="flex flex-col gap-[7px]">
            <span className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Contributeurs
            </span>
            <button
              type="button"
              className="flex h-[53px] cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm leading-none text-[var(--color-muted)]"
            >
              <span>Choisir un ou plusieurs collaborateurs</span>
              <span className="h-[12px] w-[12px] rotate-45 border-b border-r border-[var(--color-ink)]" />
            </button>
          </div>

          <Button
            type="button"
            className="mt-[31px] w-[181px]"
            disabled={!canCreateProject}
          >
            Ajouter un projet
          </Button>
        </form>
      </section>
    </div>
  );
}
