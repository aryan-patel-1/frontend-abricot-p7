import type { DashboardTask } from "../services/dashboardServices";

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
          createdAt: "2026-06-10T09:30:00.000Z",
        },
        {
          id: "mock-comment-2",
          createdAt: "2026-06-10T14:45:00.000Z",
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
          createdAt: "2026-06-14T11:20:00.000Z",
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
          createdAt: "2026-06-16T08:15:00.000Z",
        },
        {
          id: "mock-comment-5",
          createdAt: "2026-06-16T10:40:00.000Z",
        },
        {
          id: "mock-comment-6",
          createdAt: "2026-06-17T13:05:00.000Z",
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
          createdAt: "2026-06-21T16:30:00.000Z",
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
          createdAt: "2026-06-18T09:10:00.000Z",
        },
        {
          id: "mock-comment-9",
          createdAt: "2026-06-18T15:25:00.000Z",
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
          createdAt: "2026-07-03T12:00:00.000Z",
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
