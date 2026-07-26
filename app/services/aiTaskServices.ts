import type { AiGeneratedTask } from "../components/taskModalTypes";

type AiGeneratedTasksResponse = {
  tasks: AiGeneratedTask[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const AI_ERROR_MESSAGE =
  "Impossible de générer les tâches. Veuillez réessayer.";

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

export async function requestAiGeneratedTasks(prompt: string) {
  let response: Response;
  let data: unknown;

  try {
    // appelle le backend ia sans exposer sa disponibilité dans l'interface
    response = await fetch(`${API_BASE_URL}/api/ai/generate-tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
  } catch (error) {
    console.error("La génération des tâches a échoué.", error);
    throw new Error(AI_ERROR_MESSAGE);
  }

  try {
    data = (await response.json()) as unknown;
  } catch {
    throw new Error(AI_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(AI_ERROR_MESSAGE);
  }

  if (!isAiGeneratedTasksResponse(data)) {
    throw new Error(AI_ERROR_MESSAGE);
  }

  return data.tasks;
}
