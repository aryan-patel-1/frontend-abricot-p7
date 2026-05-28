export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

// centralise les appels http vers l'api
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    // envoie la requête avec un corps json par défaut
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    // transforme les erreurs réseau en message affichable par l'interface
    throw new ApiError(
      "Impossible de joindre l'API. Vérifiez votre connexion ou que le serveur est démarré.",
      0,
      "NETWORK_ERROR"
    );
  }

  let payload: ApiResponse<T> | null = null;

  try {
    // lit la réponse standard renvoyée par le backend express
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      "Réponse invalide reçue depuis l'API.",
      response.status,
      "INVALID_RESPONSE"
    );
  }

  if (!response.ok || !payload.success) {
    // conserve le message métier envoyé par l'api
    throw new ApiError(
      payload.message || "Une erreur est survenue.",
      response.status,
      payload.error
    );
  }

  if (payload.data === undefined) {
    // protège les pages contre une réponse réussie mais incomplète
    throw new ApiError(
      "La réponse de l'API ne contient pas les données attendues.",
      response.status,
      "MISSING_DATA"
    );
  }

  return payload.data;
}
