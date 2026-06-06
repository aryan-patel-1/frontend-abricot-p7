"use client";

import { useSyncExternalStore } from "react";

import Button from "../../components/button";
import TextInput from "../../components/input";
import { getSavedAuthUser, type AuthUser } from "../../services/authServices";

// lit l'utilisateur sauvegardé seulement côté navigateur
function readSavedUser() {
  return getSavedAuthUser();
}

// côté serveur localStorage n'existe pas, donc on garde l'utilisateur vide
function readSavedUserOnServer() {
  return null;
}

// met à jour le compte si la session change dans un autre onglet
function watchSavedUserChanges(onUserChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onUserChange);

  return () => window.removeEventListener("storage", onUserChange);
}

function getNameParts(user: AuthUser | null) {
  const nameParts = user?.name?.trim().split(/\s+/).filter(Boolean) ?? [];

  return {
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
  };
}

export default function AccountPage() {
  const user = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
  const { firstName, lastName } = getNameParts(user);
  const displayName = user?.name || user?.email || "Utilisateur";

  return (
    // affiche les informations du compte connecté
    <section className="mx-auto mt-[57px] w-full max-w-[1216px] rounded-lg border border-[var(--color-line)] bg-white px-[58px] py-[42px] max-[760px]:mx-5 max-[760px]:w-auto max-[760px]:px-5">
      <div className="mb-[43px]">
        <h1 className="text-xl font-semibold leading-tight text-[var(--color-ink)]">
          Mon compte
        </h1>
        <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
          {displayName}
        </p>
      </div>

      <form className="flex flex-col gap-[25px]">
        <TextInput
          id="account-last-name"
          label="Nom"
          readOnly
          type="text"
          value={lastName}
        />
        <TextInput
          id="account-first-name"
          label="Prénom"
          readOnly
          type="text"
          value={firstName}
        />
        <TextInput
          id="account-email"
          label="Email"
          readOnly
          type="email"
          value={user?.email ?? ""}
        />
        <TextInput
          id="account-password"
          label="Mot de passe"
          readOnly
          type="text"
          value="••••••••••••"
        />
        <Button type="button" className="mt-[17px] w-[242px] max-[480px]:w-full">
          Modifier les informations
        </Button>
      </form>
    </section>
  );
}
