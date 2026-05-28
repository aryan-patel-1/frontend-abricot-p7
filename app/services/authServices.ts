import { apiRequest } from "./api";

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

// appelle la route de connexion du backend
export function login(payload: LoginPayload) {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// appelle la route d'inscription du backend
export function register(payload: RegisterPayload) {
  return apiRequest<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// garde le token et l'utilisateur pour les prochains écrans
export function saveAuthSession(session: AuthSession) {
  localStorage.setItem("abricot_token", session.token);
  localStorage.setItem("abricot_user", JSON.stringify(session.user));
}
