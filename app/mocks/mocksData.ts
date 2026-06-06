import type { AuthSession, AuthUser } from "../services/authServices";
import type { DashboardTask } from "../services/dashboardServices";

export type MockUser = AuthUser & {
  password: string;
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

// tâches affichées sur le dashboard quand le backend est désactivé
export const mockAssignedTasks: { tasks: DashboardTask[] } = {
  tasks: [
    {
      id: "mock-task-1",
      title: "Préparer la page tableau de bord",
      description: "Finaliser l'affichage des tâches assignées",
      status: "IN_PROGRESS",
      dueDate: "2026-06-12",
      project: {
        id: "mock-project-1",
        name: "Abricot",
      },
      comments: [
        {
          id: "mock-comment-1",
        },
        {
          id: "mock-comment-2",
        },
      ],
    },
    {
      id: "mock-task-2",
      title: "Vérifier le formulaire de connexion",
      description: "Tester les messages d'erreur côté interface",
      status: "TODO",
      dueDate: "2026-06-18",
      project: {
        id: "mock-project-2",
        name: "Authentification",
      },
      comments: [],
    },
    {
      id: "mock-task-3",
      title: "Corriger les espacements mobile",
      description: null,
      status: "DONE",
      dueDate: null,
      project: {
        id: "mock-project-3",
        name: "Responsive",
      },
      comments: [
        {
          id: "mock-comment-3",
        },
      ],
    },
    {
      id: "mock-task-4",
      title: "Ajouter les données de test",
      description: "Préparer des données visibles sans démarrer le backend",
      status: "TODO",
      dueDate: "2026-06-25",
      project: {
        id: "mock-project-4",
        name: "Mode mock",
      },
      comments: [
        {
          id: "mock-comment-4",
        },
        {
          id: "mock-comment-5",
        },
        {
          id: "mock-comment-6",
        },
      ],
    },
  ],
};
