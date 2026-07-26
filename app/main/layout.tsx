"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import Footer from "../components/footer";
import Menu from "../components/menu";
import { hasSavedAuthSession } from "../services/authServices";

type MainLayoutProps = {
  children: ReactNode;
};

// entoure les pages privées avec la navigation et le pied de page partagés
function getLayout(children: ReactNode, pathname: string) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-[var(--color-surface-main)]">
      <Menu pathname={pathname} />
      <main className="flex-1 bg-[var(--color-surface-main)]">{children}</main>
      <Footer />
    </div>
  );
}

function readSavedSession(): boolean | null {
  return hasSavedAuthSession();
}

function readSavedSessionOnServer(): boolean | null {
  return null;
}

function watchSavedSessionChanges(onSessionChange: () => void) {
  window.addEventListener("storage", onSessionChange);

  return () => window.removeEventListener("storage", onSessionChange);
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hasSession = useSyncExternalStore(
    watchSavedSessionChanges,
    readSavedSession,
    readSavedSessionOnServer
  );

  useEffect(() => {
    // attend la lecture du navigateur avant de refuser l'accès
    if (hasSession === false) {
      router.replace("/404");
    }
  }, [hasSession, router]);

  if (hasSession !== true) {
    return null;
  }

  return getLayout(children, pathname);
}
