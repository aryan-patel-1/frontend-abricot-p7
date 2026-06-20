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

export type TaskAssignee = {
  id: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

export type TaskDetails = DashboardTask & {
  assignees: TaskAssignee[];
};

export type TaskResponse = {
  task: TaskDetails;
};

export type UpdateTaskPayload = {
  title: string;
  description: string;
  dueDate: string | null;
  status: DashboardTaskStatus;
  assigneeIds: string[];
};

// récupère les tâches assignées à l'utilisateur connecté
export function getAssignedTasks() {
  return getData(mockAssignedTasks, () =>
    apiRequest<AssignedTasksResponse>("/dashboard/assigned-tasks")
  );
}

// récupère les informations complètes nécessaires à la modale de modification
export function getTask(projectId: string, taskId: string) {
  const mockTask = mockAssignedTasks.tasks.find((task) => task.id === taskId);
  const fallbackTask: TaskDetails = {
    ...(mockTask ?? mockAssignedTasks.tasks[0]),
    assignees: [],
  };

  return getData({ task: fallbackTask }, () =>
    apiRequest<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`)
  );
}

// enregistre les champs modifiables sans exposer la logique http dans la page
export function updateTask(
  projectId: string,
  taskId: string,
  payload: UpdateTaskPayload
) {
  const mockTask = mockAssignedTasks.tasks.find((task) => task.id === taskId);
  const fallbackTask: TaskDetails = {
    ...(mockTask ?? mockAssignedTasks.tasks[0]),
    ...payload,
    assignees: [],
  };

  return getData({ task: fallbackTask }, () =>
    apiRequest<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  );
}
