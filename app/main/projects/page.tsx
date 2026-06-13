"use client";

import { useSyncExternalStore } from "react";

import Button from "../../components/button";
import CardProject from "../../components/cardProject";
import { mockProjects, mockUsers } from "../../mocks/mocksData";
import { getSavedAuthUser, type AuthUser } from "../../services/authServices";

// lit l'utilisateur sauvegardé seulement côté navigateur
function readSavedUser() {
  return getSavedAuthUser();
}

// côté serveur localStorage n'existe pas, donc on garde l'utilisateur vide
function readSavedUserOnServer() {
  return null;
}

// met à jour les projets si la session change dans un autre onglet
function watchSavedUserChanges(onUserChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onUserChange);

  return () => window.removeEventListener("storage", onUserChange);
}

function isMockAccount(user: AuthUser | null) {
  return mockUsers.some((mockUser) => mockUser.id === user?.id);
}

export default function ProjectsPage() {
  const user = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
  const projects = isMockAccount(user) ? mockProjects : [];

  return (
    <div className="mx-auto w-full max-w-[1230px] px-[30px] pb-[78px] pt-[80px] max-[760px]:px-5 max-[760px]:pt-12">
      <header className="flex items-start justify-between gap-8 max-[760px]:flex-col">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
            Mes projets
          </h1>
          <p className="mt-[14px] text-xl leading-tight text-[var(--color-ink)]">
            Gérez vos projets
          </p>
        </div>
        <Button type="button" className="mt-[14px] max-[760px]:mt-0">
          + Créer un projet
        </Button>
      </header>

      <section className="mt-[65px] grid grid-cols-3 gap-x-[14px] gap-y-[19px] max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        {projects.map((project) => (
          <CardProject key={project.id} project={project} />
        ))}
      </section>
    </div>
  );
}
