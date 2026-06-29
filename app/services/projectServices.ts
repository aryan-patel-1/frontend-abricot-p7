import type { AuthUser } from "./authServices";
import { apiRequest } from "./api";

export type ProjectRole = "OWNER" | "ADMIN" | "CONTRIBUTOR";

export type ProjectMember = {
  id: string;
  role: "ADMIN" | "CONTRIBUTOR";
  joinedAt?: string;
  userId?: string;
  projectId?: string;
  user: AuthUser;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  owner: AuthUser;
  members: ProjectMember[];
  _count: {
    tasks: number;
  };
  completedTasks?: number;
  userRole: ProjectRole | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectsResponse = {
  projects: Project[];
};

export type CreateProjectPayload = {
  name: string;
  description: string;
  contributors: string[];
};

export type CreateProjectResponse = {
  project: Project | null;
};

export type ProjectResponse = {
  project: Project;
};

export type UpdateProjectPayload = {
  name: string;
  description: string;
};

export type AddContributorPayload = {
  email: string;
  role?: "ADMIN" | "CONTRIBUTOR";
};

export type AddContributorResponse = {
  contributor: ProjectMember;
};

export type SearchUsersResponse = {
  users: AuthUser[];
};

// récupère les projets accessibles à l'utilisateur connecté
export function getProjects() {
  return apiRequest<ProjectsResponse>("/projects");
}

// récupère un projet précis pour afficher ses informations à jour
export function getProject(projectId: string) {
  return apiRequest<ProjectResponse>(`/projects/${projectId}`);
}

// crée un projet puis renvoie le projet créé avec ses membres
export function createProject(payload: CreateProjectPayload) {
  return apiRequest<CreateProjectResponse>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// modifie les informations principales d'un projet existant
export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  return apiRequest<ProjectResponse>(`/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ajoute un collaborateur existant au projet à partir de son email
export function addContributor(
  projectId: string,
  payload: AddContributorPayload
) {
  return apiRequest<AddContributorResponse>(`/projects/${projectId}/contributors`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// recherche des utilisateurs réels pour les proposer comme contributeurs
export function searchUsers(query: string) {
  return apiRequest<SearchUsersResponse>(
    `/users/search?query=${encodeURIComponent(query)}`
  );
}
