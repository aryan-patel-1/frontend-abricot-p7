import type { AuthUser } from "./authServices";
import { apiRequest } from "./api";
import { mockProjects } from "../mocks/mockProjects";
import { mockUsers } from "../mocks/mocksData";
import { getData } from "./dataProvider";

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

export type DeleteProjectResponse = {
  projectId: string;
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

// récupère un projet précis pour afficher ses informations à jour
export function getProject(projectId: string) {
  const fallbackProject = mockProjects.find((project) => project.id === projectId);

  return getData(
    {
      project: fallbackProject ?? mockProjects[0],
    },
    () => apiRequest<ProjectResponse>(`/projects/${projectId}`)
  );
}

// crée un projet puis renvoie le projet créé avec ses membres
export function createProject(payload: CreateProjectPayload) {
  const fallbackProject: Project = {
    id: `mock-project-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    members: mockUsers
      .filter((mockUser) => payload.contributors.includes(mockUser.email))
      .map((mockUser) => ({
        id: `mock-member-${mockUser.id}`,
        role: "CONTRIBUTOR",
        joinedAt: new Date().toISOString(),
        userId: mockUser.id,
        projectId: `mock-project-${Date.now()}`,
        user: mockUser,
      })),
    _count: {
      tasks: 0,
    },
    completedTasks: 0,
    userRole: "OWNER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return getData({ project: fallbackProject }, () =>
    apiRequest<CreateProjectResponse>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

// modifie les informations principales d'un projet existant
export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  const fallbackProject = mockProjects.find((project) => project.id === projectId);

  return getData(
    {
      project: {
        ...(fallbackProject ?? mockProjects[0]),
        name: payload.name,
        description: payload.description,
        updatedAt: new Date().toISOString(),
      },
    },
    () =>
      apiRequest<ProjectResponse>(`/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })
  );
}

// supprime un projet accessible à l'administrateur connecté
export function deleteProject(projectId: string) {
  return getData({ projectId }, () =>
    apiRequest<DeleteProjectResponse>(`/projects/${projectId}`, {
      method: "DELETE",
    })
  );
}

// ajoute un collaborateur existant au projet à partir de son email
export function addContributor(
  projectId: string,
  payload: AddContributorPayload
) {
  const fallbackUser = mockUsers.find((mockUser) => mockUser.email === payload.email);
  const fallbackContributor: ProjectMember = {
    id: `mock-member-${Date.now()}`,
    role: payload.role ?? "CONTRIBUTOR",
    joinedAt: new Date().toISOString(),
    userId: fallbackUser?.id ?? `mock-user-${Date.now()}`,
    projectId,
    user:
      fallbackUser ??
      {
        id: `mock-user-${Date.now()}`,
        email: payload.email,
        name: payload.email,
        createdAt: new Date().toISOString(),
      },
  };

  return getData({ contributor: fallbackContributor }, () =>
    apiRequest<AddContributorResponse>(`/projects/${projectId}/contributors`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

// recherche des utilisateurs réels pour les proposer comme contributeurs
export function searchUsers(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const fallbackUsers = mockUsers.filter(
    (mockUser) =>
      mockUser.email.toLowerCase().includes(normalizedQuery) ||
      mockUser.name?.toLowerCase().includes(normalizedQuery)
  );

  return getData(
    {
      users: fallbackUsers,
    },
    () =>
      apiRequest<SearchUsersResponse>(
        `/users/search?query=${encodeURIComponent(query)}`
      )
  );
}
