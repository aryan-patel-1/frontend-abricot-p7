import { apiRequest } from "./api";
import { mockAssignedTasks } from "../mocks/mockAssignedTasks";
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
    content?: string;
    createdAt?: string;
    author?: {
      id: string;
      email: string;
      name?: string | null;
    };
  }[];
};

export type ProjectTask = DashboardTask & {
  assignees?: TaskAssignee[];
};

export type AssignedTasksResponse = {
  tasks: DashboardTask[];
};

export type ProjectTasksResponse = {
  tasks: ProjectTask[];
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

export type CommentResponse = {
  comment: NonNullable<DashboardTask["comments"][number]>;
};

export type UpdateTaskPayload = {
  title: string;
  description: string;
  dueDate: string | null;
  status: DashboardTaskStatus;
  assigneeIds: string[];
};

export type CreateTaskPayload = UpdateTaskPayload;

export type CreateTaskCommentPayload = {
  content: string;
};

// récupère les tâches assignées à l'utilisateur connecté
export function getAssignedTasks() {
  return getData(mockAssignedTasks, () =>
    apiRequest<AssignedTasksResponse>("/dashboard/assigned-tasks")
  );
}

// récupère les tâches du projet affiché sur la page détail
export function getProjectTasks(projectId: string) {
  const mockProjectTasks = {
    tasks: mockAssignedTasks.tasks.filter((task) => task.project.id === projectId),
  };

  return getData(mockProjectTasks, () =>
    apiRequest<ProjectTasksResponse>(`/projects/${projectId}/tasks`)
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

// crée une tâche dans le projet affiché
export function createTask(projectId: string, payload: CreateTaskPayload) {
  const fallbackTask: TaskDetails = {
    id: `mock-task-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    status: payload.status,
    dueDate: payload.dueDate,
    project: {
      id: projectId,
      name: "",
    },
    comments: [],
    assignees: [],
  };

  return getData({ task: fallbackTask }, () =>
    apiRequest<TaskResponse>(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

// ajoute un commentaire à une tâche du projet affiché
export function createTaskComment(
  projectId: string,
  taskId: string,
  payload: CreateTaskCommentPayload
) {
  const fallbackComment: CommentResponse["comment"] = {
    id: `mock-comment-${Date.now()}`,
    content: payload.content,
    createdAt: new Date().toISOString(),
  };

  return getData({ comment: fallbackComment }, () =>
    apiRequest<CommentResponse>(
      `/projects/${projectId}/tasks/${taskId}/comments`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    )
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
