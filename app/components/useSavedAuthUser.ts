"use client";

import { useSyncExternalStore } from "react";

import { getSavedAuthUser, type AuthUser } from "../services/authServices";

// ce hook expose l'utilisateur connecté sauvegardé dans le navigateur
function readSavedUser() {
  return getSavedAuthUser();
}

function readSavedUserOnServer() {
  return null;
}

function watchSavedUserChanges(onUserChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onUserChange);

  return () => window.removeEventListener("storage", onUserChange);
}

export default function useSavedAuthUser(): AuthUser | null {
  return useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
}
