import { apiRequest } from "./api";
import { mockAssignedTasks } from "../mocks/mocksData";
import { getData } from "./dataProvider";

export type DashboardTaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

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

export type AssignedTasksResponse = {
  tasks: DashboardTask[];
};

// récupère les tâches assignées à l'utilisateur connecté
export function getAssignedTasks() {
  return getData(mockAssignedTasks, () =>
    apiRequest<AssignedTasksResponse>("/dashboard/assigned-tasks")
  );
}
