"use client";

import Link from "next/link";

import useSavedAuthUser from "./useSavedAuthUser";

// ce composant bloque l'accès au tableau de bord si aucune session n'est trouvée
export default function NotFoundActions() {
  const user = useSavedAuthUser();
  const dashboardClassName =
    "inline-flex min-h-[50px] items-center justify-center rounded-lg px-7 py-3 text-center text-base leading-tight no-underline transition-[background-color,transform] duration-150 max-[520px]:w-full";

  return (
    <div className="mt-9 flex flex-wrap justify-center gap-3 max-[520px]:w-full max-[520px]:flex-col">
      {user ? (
        <Link
          href="/main/dashboard"
          className={`${dashboardClassName} bg-[var(--color-action)] text-white hover:bg-[var(--color-ink)] active:translate-y-px`}
        >
          Retour au tableau de bord
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={`${dashboardClassName} cursor-not-allowed bg-[#e5e7eb] text-[var(--color-muted)]`}
        >
          Retour au tableau de bord
        </button>
      )}
      <Link
        href="/login"
        className="inline-flex min-h-[50px] items-center justify-center rounded-lg border border-[var(--color-line)] bg-white px-7 py-3 text-center text-base leading-tight text-[var(--color-ink)] no-underline transition-[border-color,color] duration-150 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] max-[520px]:w-full"
      >
        Se connecter
      </Link>
    </div>
  );
}
