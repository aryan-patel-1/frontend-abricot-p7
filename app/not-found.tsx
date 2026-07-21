import Link from "next/link";
import type { Metadata } from "next";

import Logo from "./components/logo";
import NotFoundActions from "./components/notFoundActions";

export const metadata: Metadata = {
  title: "Page introuvable - Abricot",
  description: "La page demandée est introuvable.",
};

// propose une sortie adaptée selon la présence d'une session locale
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-[var(--color-surface-main)] px-5 py-10 text-[var(--color-ink)]">
      <header className="mx-auto flex w-full max-w-[1080px] items-center">
        <Link href="/login" aria-label="Abricot">
          <Logo className="w-[146px]" />
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center py-16 text-center">
        <h1 className="flex flex-col items-center">
          <span className="text-[76px] font-semibold leading-none text-[var(--color-brand)] max-[520px]:text-[56px]">
            404
          </span>
          <span className="mt-6 text-[32px] font-semibold leading-tight text-[var(--color-heading)] max-[520px]:text-[26px]">
            Page introuvable
          </span>
        </h1>
        <p className="mt-4 max-w-[520px] text-base leading-[1.5] text-[var(--color-muted)]">
          L&apos;adresse demandée n&apos;existe pas ou a été déplacée.
        </p>

        <NotFoundActions />
      </section>
    </main>
  );
}
