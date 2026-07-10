import type {
  DashboardTaskStatus,
  ProjectTask,
} from "../services/dashboardServices";
import type { Project } from "../services/projectServices";
import type { ProjectDisplayTask, ProjectMember, ProjectTaskStatusFilter } from "./projectDetailTypes";
import type { TaskAssigneeOption } from "./taskModalTypes";
import type { TaskStatus } from "./taskStatusBadge";

const taskStatusByApiStatus: Record<DashboardTaskStatus, TaskStatus> = {
  TODO: "todo",
  IN_PROGRESS: "progress",
  DONE: "done",
};

export const fallbackProjectMembers: ProjectMember[] = [
  { initials: "AD", name: "Anne Dupont", role: "Propriétaire" },
  { initials: "BD", name: "Bertrand Dupont" },
  { initials: "AD", name: "Anne Dupont" },
];

export const statusFilterOptions: {
  label: string;
  value: ProjectTaskStatusFilter;
}[] = [
  { label: "Tous", value: "all" },
  { label: "À faire", value: "todo" },
  { label: "En cours", value: "progress" },
  { label: "Terminée", value: "done" },
];

export function getInitials(name: string) {
  // crée les initiales courtes utilisées dans les badges utilisateur
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getCommentCreatedAt(createdAt?: string) {
  // garantit une date affichable quand le mock ou l'api ne fournit pas createdAt
  return createdAt ?? new Date().toISOString();
}

export function toProjectDisplayTask(task: ProjectTask): ProjectDisplayTask {
  // adapte la réponse api au format simple utilisé par les composants de la page
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: taskStatusByApiStatus[task.status],
    dueDate: task.dueDate,
    assignees:
      task.assignees?.map((assignee) => {
        const name = assignee.user.name || assignee.user.email;

        return {
          initials: getInitials(name),
          name,
        };
      }) ?? [],
    comments: task.comments.map((comment) => {
      const authorName = comment.author?.name || comment.author?.email || "Utilisateur";

      return {
        id: comment.id,
        content: comment.content ?? "",
        createdAt: getCommentCreatedAt(comment.createdAt),
        authorName,
        authorInitials: getInitials(authorName),
      };
    }),
  };
}

export function getProjectMembers(project: Project | null): ProjectMember[] {
  if (!project) {
    return fallbackProjectMembers;
  }

  // place le propriétaire en premier pour garder le même ordre d'affichage
  return [
    {
      initials: getInitials(project.owner.name || project.owner.email),
      name: project.owner.name || project.owner.email,
      role: "Propriétaire",
    },
    ...project.members.map((member) => {
      const name = member.user.name || member.user.email;

      return {
        initials: getInitials(name),
        name,
      };
    }),
  ];
}

export function getTaskAssigneeOptions(project: Project | null): TaskAssigneeOption[] {
  if (!project) {
    return [];
  }

  // fournit aux modales la même liste que les contributeurs visibles
  return [
    {
      id: project.owner.id,
      name: project.owner.name || project.owner.email,
    },
    ...project.members.map((member) => ({
      id: member.user.id,
      name: member.user.name || member.user.email,
    })),
  ];
}

export function matchesProjectTaskFilters(
  task: ProjectDisplayTask,
  searchText: string,
  selectedStatus: ProjectTaskStatusFilter
) {
  const normalizedSearch = searchText.trim().toLowerCase();
  const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
  const matchesSearch =
    normalizedSearch.length === 0 ||
    [task.title, task.description ?? ""].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    );

  return matchesStatus && matchesSearch;
}

export function sortProjectTasksByDueDate(
  tasksToSort: ProjectDisplayTask[],
  direction: "asc" | "desc"
) {
  // copie le tableau pour trier sans modifier l'état react d'origine
  return [...tasksToSort].sort((firstTask, secondTask) => {
    if (!firstTask.dueDate && !secondTask.dueDate) {
      return 0;
    }

    if (!firstTask.dueDate) {
      return 1;
    }

    if (!secondTask.dueDate) {
      return -1;
    }

    const firstDateTime = new Date(firstTask.dueDate).getTime();
    const secondDateTime = new Date(secondTask.dueDate).getTime();

    return direction === "asc"
      ? firstDateTime - secondDateTime
      : secondDateTime - firstDateTime;
  });
}