"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

import Button from "./button";
import type { AiGeneratedTask } from "./taskModalTypes";

type EditAiGeneratedTaskModalProps = {
  onClose: () => void;
  onSaved: (task: AiGeneratedTask) => void;
  task: AiGeneratedTask;
};

export default function EditAiGeneratedTaskModal({
  onClose,
  onSaved,
  task,
}: EditAiGeneratedTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const canSave = title.trim().length >= 2;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // modifie seulement la prévisualisation, pas encore la base de données
    event.preventDefault();

    if (!canSave) {
      return;
    }

    onSaved({
      title: title.trim(),
      description: description.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/30 px-5 py-8">
      <section
        aria-labelledby="edit-ai-task-title"
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
            className="block h-5 w-5"
          />
        </button>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h2
            id="edit-ai-task-title"
            className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
          >
            Modifier
          </h2>

          <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Titre
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-4 text-sm text-[var(--color-muted)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Description
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-4 text-sm text-[var(--color-muted)] outline-none focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <Button
            type="submit"
            disabled={!canSave}
            className={`mt-[56px] w-[244px] ${
              canSave
                ? ""
                : "bg-[#e5e7eb] text-[var(--color-muted)] hover:bg-[#e5e7eb] disabled:opacity-100"
            }`}
          >
            Enregistrer
          </Button>
        </form>
      </section>
    </div>
  );
}
