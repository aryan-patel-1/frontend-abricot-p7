import type { AuthSession, AuthUser } from "../services/authServices";
import type { DashboardTask } from "../services/dashboardServices";

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

// projets proches de la forme renvoyée par GET /projects côté backend
export const mockProjects: MockProject[] = [
  {
    id: "mock-project-1",
    name: "Refonte API",
    description:
      "Développement de la nouvelle version de l'API REST avec authentification JWT",
    ownerId: mockUsers[0].id,
    owner: mockUser,
    members: [
      {
        id: "mock-member-1",
        role: "CONTRIBUTOR",
        joinedAt: "2026-06-06T00:00:00.000Z",
        userId: mockUsers[1].id,
        projectId: "mock-project-1",
        user: {
          id: mockUsers[1].id,
          email: mockUsers[1].email,
          name: mockUsers[1].name,
          createdAt: mockUsers[1].createdAt,
        },
      },
      {
        id: "mock-member-2",
        role: "CONTRIBUTOR",
        joinedAt: "2026-06-06T00:00:00.000Z",
        userId: mockUsers[2].id,
        projectId: "mock-project-1",
        user: {
          id: mockUsers[2].id,
          email: mockUsers[2].email,
          name: mockUsers[2].name,
          createdAt: mockUsers[2].createdAt,
        },
      },
    ],
    _count: {
      tasks: 2,
    },
    completedTasks: 0,
    userRole: "OWNER",
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-08T10:30:00.000Z",
  },
  {
    id: "mock-project-2",
    name: "Espace client",
    description: "Création d'un espace client pour suivre les demandes en cours",
    ownerId: mockUsers[0].id,
    owner: mockUser,
    members: [],
    _count: {
      tasks: 5,
    },
    completedTasks: 2,
    userRole: "OWNER",
    createdAt: "2026-05-28T09:00:00.000Z",
    updatedAt: "2026-06-07T15:20:00.000Z",
  },
  {
    id: "mock-project-3",
    name: "Design system",
    description: "Organisation des composants réutilisables du frontend Abricot",
    ownerId: mockUsers[1].id,
    owner: {
      id: mockUsers[1].id,
      email: mockUsers[1].email,
      name: mockUsers[1].name,
      createdAt: mockUsers[1].createdAt,
    },
    members: [
      {
        id: "mock-member-3",
        role: "ADMIN",
        joinedAt: "2026-05-25T00:00:00.000Z",
        userId: mockUsers[0].id,
        projectId: "mock-project-3",
        user: mockUser,
      },
    ],
    _count: {
      tasks: 4,
    },
    completedTasks: 1,
    userRole: "ADMIN",
    createdAt: "2026-05-25T11:10:00.000Z",
    updatedAt: "2026-06-06T08:45:00.000Z",
  },
  {
    id: "mock-project-4",
    name: "Mode mock",
    description: "Préparer des données visibles sans démarrer le backend",
    ownerId: mockUsers[0].id,
    owner: mockUser,
    members: [
      {
        id: "mock-member-4",
        role: "CONTRIBUTOR",
        joinedAt: "2026-06-02T00:00:00.000Z",
        userId: mockUsers[2].id,
        projectId: "mock-project-4",
        user: {
          id: mockUsers[2].id,
          email: mockUsers[2].email,
          name: mockUsers[2].name,
          createdAt: mockUsers[2].createdAt,
        },
      },
    ],
    _count: {
      tasks: 3,
    },
    completedTasks: 0,
    userRole: "OWNER",
    createdAt: "2026-06-02T14:00:00.000Z",
    updatedAt: "2026-06-05T16:40:00.000Z",
  },
  {
    id: "mock-project-5",
    name: "Authentification",
    description: "Sécurisation des pages privées avec les sessions utilisateur",
    ownerId: mockUsers[0].id,
    owner: mockUser,
    members: [],
    _count: {
      tasks: 6,
    },
    completedTasks: 4,
    userRole: "OWNER",
    createdAt: "2026-05-20T10:15:00.000Z",
    updatedAt: "2026-06-04T13:15:00.000Z",
  },
  {
    id: "mock-project-6",
    name: "Responsive",
    description: "Adaptation des écrans principaux sur mobile et tablette",
    ownerId: mockUsers[2].id,
    owner: {
      id: mockUsers[2].id,
      email: mockUsers[2].email,
      name: mockUsers[2].name,
      createdAt: mockUsers[2].createdAt,
    },
    members: [
      {
        id: "mock-member-5",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-22T00:00:00.000Z",
        userId: mockUsers[0].id,
        projectId: "mock-project-6",
        user: mockUser,
      },
    ],
    _count: {
      tasks: 4,
    },
    completedTasks: 4,
    userRole: "CONTRIBUTOR",
    createdAt: "2026-05-22T08:30:00.000Z",
    updatedAt: "2026-06-03T17:10:00.000Z",
  },
  {
    id: "mock-project-7",
    name: "Commentaires",
    description: "Ajout des échanges sur les tâches et leur historique",
    ownerId: mockUsers[0].id,
    owner: mockUser,
    members: [
      {
        id: "mock-member-6",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-18T00:00:00.000Z",
        userId: mockUsers[1].id,
        projectId: "mock-project-7",
        user: {
          id: mockUsers[1].id,
          email: mockUsers[1].email,
          name: mockUsers[1].name,
          createdAt: mockUsers[1].createdAt,
        },
      },
    ],
    _count: {
      tasks: 7,
    },
    completedTasks: 3,
    userRole: "OWNER",
    createdAt: "2026-05-18T12:00:00.000Z",
    updatedAt: "2026-06-02T09:35:00.000Z",
  },
  {
    id: "mock-project-8",
    name: "Priorités tâches",
    description: "Mise en place des niveaux de priorité sur les tâches projet",
    ownerId: mockUsers[1].id,
    owner: {
      id: mockUsers[1].id,
      email: mockUsers[1].email,
      name: mockUsers[1].name,
      createdAt: mockUsers[1].createdAt,
    },
    members: [
      {
        id: "mock-member-7",
        role: "ADMIN",
        joinedAt: "2026-05-16T00:00:00.000Z",
        userId: mockUsers[0].id,
        projectId: "mock-project-8",
        user: mockUser,
      },
      {
        id: "mock-member-8",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-17T00:00:00.000Z",
        userId: mockUsers[2].id,
        projectId: "mock-project-8",
        user: {
          id: mockUsers[2].id,
          email: mockUsers[2].email,
          name: mockUsers[2].name,
          createdAt: mockUsers[2].createdAt,
        },
      },
    ],
    _count: {
      tasks: 8,
    },
    completedTasks: 5,
    userRole: "ADMIN",
    createdAt: "2026-05-16T09:45:00.000Z",
    updatedAt: "2026-06-01T14:25:00.000Z",
  },
  {
    id: "mock-project-9",
    name: "Documentation API",
    description: "Rédaction des routes backend et des exemples Swagger",
    ownerId: mockUsers[0].id,
    owner: mockUser,
    members: [],
    _count: {
      tasks: 2,
    },
    completedTasks: 1,
    userRole: "OWNER",
    createdAt: "2026-05-12T16:00:00.000Z",
    updatedAt: "2026-05-30T11:55:00.000Z",
  },
];

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
    {
      id: "mock-task-5",
      title: "Relire les routes projets",
      description: "Vérifier les réponses attendues pour la liste des projets",
      status: "IN_PROGRESS",
      dueDate: "2026-06-28",
      project: {
        id: "mock-project-1",
        name: "Refonte API",
      },
      comments: [
        {
          id: "mock-comment-7",
        },
      ],
    },
    {
      id: "mock-task-6",
      title: "Préparer les écrans d'inscription",
      description: "Contrôler les champs et les messages de validation",
      status: "TODO",
      dueDate: "2026-07-02",
      project: {
        id: "mock-project-2",
        name: "Espace client",
      },
      comments: [],
    },
    {
      id: "mock-task-7",
      title: "Nettoyer les composants partagés",
      description: "Regrouper les champs réutilisables au même endroit",
      status: "DONE",
      dueDate: "2026-06-20",
      project: {
        id: "mock-project-4",
        name: "Mode mock",
      },
      comments: [
        {
          id: "mock-comment-8",
        },
        {
          id: "mock-comment-9",
        },
      ],
    },
    {
      id: "mock-task-8",
      title: "Tester la recherche des tâches",
      description: "S'assurer que le filtre démarre après trois lettres",
      status: "TODO",
      dueDate: "2026-07-05",
      project: {
        id: "mock-project-8",
        name: "Tests fonctionnels",
      },
      comments: [
        {
          id: "mock-comment-10",
        },
      ],
    },
    {
      id: "mock-task-9",
      title: "Compléter la documentation API",
      description: "Ajouter les exemples de payload pour les endpoints principaux",
      status: "IN_PROGRESS",
      dueDate: "2026-07-08",
      project: {
        id: "mock-project-9",
        name: "Documentation API",
      },
      comments: [],
    },
  ],
};
