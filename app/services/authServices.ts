import { ApiError, apiRequest } from "./api";
import { mockUsers } from "../mocks/mocksData";
import { getData, isUsingMockData } from "./dataProvider";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name?: string;
};

// garde le même objet utilisateur tant que localStorage ne change pas
let lastSavedUserText: string | null = null;
let lastSavedUser: AuthUser | null = null;

// enlève le mot de passe avant de sauvegarder l'utilisateur côté frontend
function toAuthUser(user: (typeof mockUsers)[number]): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

// appelle la route de connexion du backend
export function login(payload: LoginPayload) {
  if (isUsingMockData()) {
    // reproduit la vérification email et mot de passe du backend avec les comptes mockés
    const user = mockUsers.find(
      (mockAccount) =>
        mockAccount.email === payload.email.trim() &&
        mockAccount.password === payload.password
    );

    if (!user) {
      return Promise.reject(
        new ApiError("Email ou mot de passe incorrect.", 401, "INVALID_CREDENTIALS")
      );
    }

    return Promise.resolve({
      user: toAuthUser(user),
      token: "mock-token",
    });
  }

  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// appelle la route d'inscription du backend
export function register(payload: RegisterPayload) {
  return getData(
    {
      user: {
        id: "mock-user-new",
        email: payload.email.trim(),
        name: payload.name || null,
        createdAt: new Date().toISOString(),
      },
      token: "mock-token",
    },
    () =>
      apiRequest<AuthSession>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      })
  );
}

// garde le token et l'utilisateur pour les prochains écrans
export function saveAuthSession(session: AuthSession) {
  localStorage.setItem("abricot_token", session.token);
  localStorage.setItem("abricot_user", JSON.stringify(session.user));
}

// supprime les informations de session sauvegardées dans le navigateur
export function logout() {
  localStorage.removeItem("abricot_token");
  localStorage.removeItem("abricot_user");
  lastSavedUserText = null;
  lastSavedUser = null;
}

// relit l'utilisateur sauvegardé après la connexion
export function getSavedAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const savedUser = localStorage.getItem("abricot_user");

  if (savedUser === lastSavedUserText) {
    return lastSavedUser;
  }

  lastSavedUserText = savedUser;

  if (!savedUser) {
    lastSavedUser = null;
    return null;
  }

  try {
    lastSavedUser = JSON.parse(savedUser) as AuthUser;
    return lastSavedUser;
  } catch {
    lastSavedUser = null;
    return null;
  }
}

// vérifie que le navigateur contient les deux éléments nécessaires à la session
export function hasSavedAuthSession() {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("abricot_token");

  return Boolean(token && getSavedAuthUser());
}
