"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import Button from "../../components/button";
import TextInput from "../../components/input";
import {
  getSavedAuthUser,
  logout,
  type AuthUser,
} from "../../services/authServices";

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
  const router = useRouter();
  const user = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
  const { firstName, lastName } = getNameParts(user);
  const displayName = user?.name || user?.email || "Utilisateur";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="mx-auto w-full max-w-[1408px] px-4 pb-[57px] pt-[48px] max-[900px]:px-5 max-[900px]:pt-10 max-[520px]:pb-10">
      <section className="w-full rounded-lg border border-[var(--color-line)] bg-white px-8 py-[42px] max-[900px]:px-5">
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
          <div className="mt-[17px] flex flex-wrap gap-4">
            <Button type="button" className="w-[242px] max-[480px]:w-full">
              Modifier les informations
            </Button>
            <Button
              type="button"
              className="w-[242px] max-[480px]:w-full"
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
