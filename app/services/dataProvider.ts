// active les données de test pour utiliser le frontend sans backend
export const USE_MOCK = false;

// centralise le mode de données utilisé par les services
export function isUsingMockData() {
  return USE_MOCK;
}

// choisit entre la donnée mockée et l'appel api réel
export function getData<T>(mockData: T, apiCall: () => Promise<T>) {
  if (USE_MOCK) {
    return Promise.resolve(mockData);
  }

  return apiCall();
}
