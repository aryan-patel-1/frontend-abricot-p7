// forme standard renvoyée par le backend express
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

// erreur liée à un champ précis d'un formulaire
export type ApiValidationError = {
  field: string;
  message: string;
};

type ApiErrorData = {
  errors?: ApiValidationError[];
};

export const GENERIC_ERROR_MESSAGE =
  "Une erreur est survenue. Veuillez réessayer.";

// erreur personnalisée pour garder les détails utiles côté frontend
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

// enlève le slash final pour éviter une url du type /api//auth/login
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

// récupère le token sauvegardé après la connexion
function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = localStorage.getItem("abricot_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// récupère les erreurs de validation envoyées par le backend
function getValidationErrors(payload: ApiResponse<unknown>) {
  const errorData = payload.data as ApiErrorData | undefined;

  if (!Array.isArray(errorData?.errors)) {
    return [];
  }

  return errorData.errors.filter(
    (error): error is ApiValidationError =>
      typeof error?.field === "string" && typeof error?.message === "string"
  );
}

// centralise les appels http vers l'api et renvoie seulement les données utiles
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  let response: Response;
  const requestUrl = `${API_BASE_URL}${path}`;
  const headers = new Headers(init.headers);

  headers.set("Content-Type", "application/json");

  for (const [name, value] of Object.entries(getAuthHeaders())) {
    headers.set(name, value);
  }

  try {
    // envoie la requête au backend avec un corps json par défaut
    response = await fetch(requestUrl, {
      ...init,
      headers,
    });
  } catch (error) {
    // signale au développeur que le backend ne répond pas
    console.error("L'API n'est pas connectée.", error);

    // garde l'origine technique hors du message destiné à l'utilisateur
    throw new ApiError(GENERIC_ERROR_MESSAGE, 0, "NETWORK_ERROR");
  }

  let payload: ApiResponse<T> | null = null;

  try {
    // lit la réponse standard renvoyée par le backend express
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      GENERIC_ERROR_MESSAGE,
      response.status,
      "INVALID_RESPONSE"
    );
  }

  if (!response.ok || !payload.success) {
    const validationErrors = getValidationErrors(payload);

    // conserve les détails pour le code sans afficher le message brut reçu
    throw new ApiError(
      GENERIC_ERROR_MESSAGE,
      response.status,
      payload.error,
      validationErrors
    );
  }

  if (payload.data === undefined) {
    // protège les pages contre une réponse réussie mais incomplète
    throw new ApiError(
      GENERIC_ERROR_MESSAGE,
      response.status,
      "MISSING_DATA"
    );
  }

  return payload.data;
}
