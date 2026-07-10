import type { AuthSession, AuthUser } from "../services/authServices";

export type MockUser = AuthUser & {
  password: string;
};

export type MockProjectMember = {
  id: string;
  role: "ADMIN" | "CONTRIBUTOR";
  joinedAt: string;
  userId: string;
  projectId: string;
  user: AuthUser;
};

export type MockProject = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  owner: AuthUser;
  members: MockProjectMember[];
  _count: {
    tasks: number;
  };
  completedTasks: number;
  userRole: "OWNER" | "ADMIN" | "CONTRIBUTOR";
  createdAt: string;
  updatedAt: string;
};

// comptes dédiés au mode mock, séparés des comptes du seed backend
export const mockUsers: MockUser[] = [
  {
    id: "mock-user-1",
    email: "nina.mock@abricot.fr",
    name: "Nina Bernard",
    password: "P@ssword123",
    createdAt: "2026-06-06T00:00:00.000Z",
  },
  {
    id: "mock-user-2",
    email: "leo.mock@abricot.fr",
    name: "Léo Garnier",
    password: "P@ssword123",
    createdAt: "2026-06-06T00:00:00.000Z",
  },
  {
    id: "mock-user-3",
    email: "maya.mock@abricot.fr",
    name: "Maya Lefevre",
    password: "P@ssword123",
    createdAt: "2026-06-06T00:00:00.000Z",
  },
];

// utilisateur affiché par défaut quand aucune session réelle n'est nécessaire
export const mockUser: AuthUser = {
  id: mockUsers[0].id,
  email: mockUsers[0].email,
  name: mockUsers[0].name,
  createdAt: mockUsers[0].createdAt,
};

// session utilisée par les formulaires quand le backend est désactivé
export const mockAuthSession: AuthSession = {
  user: mockUser,
  token: "mock-token",
};
