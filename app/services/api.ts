export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type ApiValidationError = {
  field: string;
  message: string;
};

type ApiErrorData = {
  errors?: ApiValidationError[];
};

export class ApiError extends Error {
  status: number;
  code?: string;
  validationErrors: ApiValidationError[];

  constructor(
    message: string,
    status: number,
    code?: string,
    validationErrors: ApiValidationError[] = []
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.validationErrors = validationErrors;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

function getValidationErrors(payload: ApiResponse<unknown>) {
  const data = payload.data as ApiErrorData | undefined;

  if (!Array.isArray(data?.errors)) {
    return [];
  }

  return data.errors.filter(
    (error): error is ApiValidationError =>
      typeof error?.field === "string" && typeof error?.message === "string"
  );
}

function getErrorMessage(
  payload: ApiResponse<unknown>,
  fallback: string,
  validationErrors: ApiValidationError[]
) {
  const validationMessage = validationErrors
    .map((error) => error.message.trim())
    .filter(Boolean)
    .join(" ");

  return validationMessage || payload.message || fallback;
}

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
    const validationErrors = getValidationErrors(payload);

    // conserve le message métier envoyé par l'api
    throw new ApiError(
      getErrorMessage(payload, "Une erreur est survenue.", validationErrors),
      response.status,
      payload.error,
      validationErrors
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
