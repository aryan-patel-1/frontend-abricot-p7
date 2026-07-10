import type { AiGeneratedTask } from "../components/taskModalTypes";

type AiGeneratedTasksResponse = {
  tasks: AiGeneratedTask[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

// vérifie au runtime qu'une tâche ia contient les champs attendus
function isAiGeneratedTask(value: unknown): value is AiGeneratedTask {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.title === "string" &&
    typeof task.description === "string"
  );
}

// sécurise le json reçu avant de l'utiliser dans l'interface
function isAiGeneratedTasksResponse(
  value: unknown
): value is AiGeneratedTasksResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Record<string, unknown>;

  return Array.isArray(response.tasks) && response.tasks.every(isAiGeneratedTask);
}

function getApiErrorMessage(value: unknown) {
  if (!value || typeof value !== "object") {
    return "Impossible de générer les tâches.";
  }

  const response = value as Record<string, unknown>;

  return typeof response.message === "string"
    ? response.message
    : "Impossible de générer les tâches.";
}

export async function requestAiGeneratedTasks(prompt: string) {
  // appelle le backend ia et vérifie que la réponse contient bien des tâches
  const response = await fetch(`${API_BASE_URL}/api/ai/generate-tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  let data: unknown;

  try {
    data = (await response.json()) as unknown;
  } catch {
    throw new Error("Réponse invalide reçue depuis l'API.");
  }

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data));
  }

  if (!isAiGeneratedTasksResponse(data)) {
    throw new Error("La réponse de l'IA est invalide.");
  }

  return data.tasks;
}