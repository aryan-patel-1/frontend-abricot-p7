import type { AuthUser } from "./authServices";
import { apiRequest } from "./api";
import { getData } from "./dataProvider";
import { mockProjects } from "../mocks/mocksData";

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

export type SearchUsersResponse = {
  users: AuthUser[];
};

// récupère les projets accessibles à l'utilisateur connecté
export function getProjects() {
  return getData({ projects: mockProjects }, () =>
    apiRequest<ProjectsResponse>("/projects")
  );
}

// crée un projet puis renvoie le projet créé avec ses membres
export function createProject(payload: CreateProjectPayload) {
  return getData(
    {
      project: {
        ...mockProjects[0],
        id: `mock-project-${Date.now()}`,
        name: payload.name,
        description: payload.description,
      },
    },
    () =>
      apiRequest<CreateProjectResponse>("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      })
  );
}

// recherche des utilisateurs réels pour les proposer comme contributeurs
export function searchUsers(query: string) {
  return apiRequest<SearchUsersResponse>(
    `/users/search?query=${encodeURIComponent(query)}`
  );
}
