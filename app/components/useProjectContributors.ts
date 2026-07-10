"use client";

import { useEffect, useState } from "react";

import { mockUsers } from "../mocks/mocksData";
import type { AuthUser } from "../services/authServices";
import { isUsingMockData } from "../services/dataProvider";
import { searchUsers } from "../services/projectServices";

// ce hook prépare la liste des contributeurs disponibles pour les modales projet
function isMockAccount(user: AuthUser | null) {
  return mockUsers.some((mockUser) => mockUser.id === user?.id);
}

export default function useProjectContributors(
  user: AuthUser | null,
  shouldLoadContributors: boolean
) {
  const [apiContributors, setApiContributors] = useState<AuthUser[]>([]);
  const [contributorsError, setContributorsError] = useState("");
  const contributors =
    isUsingMockData() || isMockAccount(user)
      ? mockUsers.filter((mockUser) => mockUser.id !== user?.id)
      : apiContributors;

  useEffect(() => {
    if (!shouldLoadContributors || isUsingMockData() || isMockAccount(user)) {
      return;
    }

    async function loadContributors() {
      setContributorsError("");

      try {
        const data = await searchUsers("co");
        setApiContributors(
          data.users.filter((apiUser) => apiUser.id !== user?.id)
        );
      } catch (error) {
        setApiContributors([]);
        setContributorsError(
          error instanceof Error
            ? error.message
            : "Impossible de charger les contributeurs."
        );
      }
    }

    loadContributors();
  }, [shouldLoadContributors, user]);

  return {
    contributors,
    contributorsError,
  };
}
