import type { DashboardTaskStatus } from "../services/dashboardServices";
import type { TaskStatus } from "./taskStatusBadge";

// regroupe les formes de données communes aux modales de tâche
export type TaskAssigneeOption = {
  id: string;
  name: string;
};

export type AiGeneratedTask = {
  title: string;
  description: string;
};

export const editableStatuses: {
  value: DashboardTaskStatus;
  status: TaskStatus;
}[] = [
  { value: "TODO", status: "todo" },
  { value: "IN_PROGRESS", status: "progress" },
  { value: "DONE", status: "done" },
];
