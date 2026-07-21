import type { TaskStatus } from "./taskStatusBadge";

// décrit les données déjà adaptées pour l'affichage du détail d'un projet
export type ProjectMember = {
  initials: string;
  name: string;
  role?: string;
};

export type ProjectTaskComment = {
  id: string;
  content: string;
  createdAt: string | null;
  authorName: string;
  authorInitials: string;
};

export type ProjectDisplayTask = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  assignees: ProjectMember[];
  comments: ProjectTaskComment[];
};

export type ProjectTaskStatusFilter = TaskStatus | "all";

export type ProjectTaskView = "list" | "calendar";