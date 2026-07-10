"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

type AiPromptBarProps = {
  disabled: boolean;
  onSubmit: (prompt: string) => Promise<boolean>;
};

export default function AiPromptBar({ disabled, onSubmit }: AiPromptBarProps) {
  const [prompt, setPrompt] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // permet de lancer le prompt avec entrée ou le bouton d'envoi
    event.preventDefault();

    if (!prompt.trim() || disabled) {
      return;
    }

    const isSubmitted = await onSubmit(prompt.trim());

    if (isSubmitted) {
      setPrompt("");
    }
  }

  return (
    <form
      className="rounded-full bg-[#f9fafb] px-[32px] py-[18px] max-[640px]:px-5 max-[420px]:rounded-2xl"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-4 max-[420px]:items-start">
        <input
          type="text"
          aria-label="Décrire les tâches à ajouter"
          placeholder="Décrivez les tâches que vous souhaitez ajouter..."
          value={prompt}
          disabled={disabled}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs leading-tight text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]"
        />
        <button
          type="submit"
          aria-label="Envoyer la demande"
          className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full bg-[var(--color-brand)] text-white disabled:opacity-60"
          disabled={disabled || prompt.trim() === ""}
        >
          <Image
            src="/img/IA-icon-white.svg"
            alt=""
            width={12}
            height={12}
            className="block h-3 w-3"
          />
        </button>
      </div>
    </form>
  );
}
