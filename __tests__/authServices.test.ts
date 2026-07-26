import { afterEach, expect, test } from "vitest";

import {
  getSavedAuthUser,
  hasSavedAuthSession,
  logout,
  saveAuthSession,
  type AuthSession,
} from "@/app/services/authServices";

const savedSession: AuthSession = {
  token: "mock-token",
  user: {
    id: "mock-user-test",
    email: "test.mock@abricot.fr",
    name: "Test Abricot",
    createdAt: "2026-07-25T00:00:00.000Z",
  },
};

afterEach(() => {
  logout();
});

test("reconnaît une session sauvegardée en mode mock", () => {
  saveAuthSession(savedSession);

  expect(hasSavedAuthSession()).toBe(true);
  expect(getSavedAuthUser()).toEqual(savedSession.user);
});

test("ne garde pas un utilisateur connecté après la déconnexion", () => {
  saveAuthSession(savedSession);
  logout();

  expect(hasSavedAuthSession()).toBe(false);
  expect(getSavedAuthUser()).toBeNull();
});
