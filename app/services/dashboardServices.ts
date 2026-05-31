import { apiRequest } from "./api";

export type DashboardTaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type DashboardTask = {
  id: string;
  title: string;
  description: string | null;
  status: DashboardTaskStatus;
  dueDate: string | null;
  project: {
    id: string;
    name: string;
  };
  comments: {
    id: string;
  }[];
};

type AssignedTasksResponse = {
  tasks: DashboardTask[];
};

// récupère les tâches assignées à l'utilisateur connecté
export function getAssignedTasks() {
  return apiRequest<AssignedTasksResponse>("/dashboard/assigned-tasks");
}