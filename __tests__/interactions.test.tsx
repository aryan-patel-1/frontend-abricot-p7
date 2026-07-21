import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test } from "vitest";

import Button from "@/app/components/button";
import CardProject from "@/app/components/cardProject";
import { ViewTabs, type DashboardView } from "@/app/components/chips";
import type { Project } from "@/app/services/projectServices";

afterEach(() => {
  // nettoie le dom après chaque test pour éviter qu'un rendu influence le suivant
  cleanup();
});

// composant minimal utilisé pour tester le comportement normal du bouton
function ClickCounter() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <>
      <Button onClick={() => setClickCount((count) => count + 1)}>
        Ajouter
      </Button>
      <p>Compteur : {clickCount}</p>
    </>
  );
}

// composant minimal utilisé pour tester le cas du bouton désactivé
function DisabledCounter() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <>
      <Button disabled onClick={() => setClickCount((count) => count + 1)}>
        Ajouter
      </Button>
      <p>Compteur : {clickCount}</p>
    </>
  );
}

// composant de test qui reproduit le choix de vue du tableau de bord
function DashboardViewSelector() {
  const [activeView, setActiveView] = useState<DashboardView>("list");

  return (
    <>
      <ViewTabs activeView={activeView} onViewChange={setActiveView} />
      <p>Vue active : {activeView}</p>
    </>
  );
}

// projet de test avec seulement les données nécessaires à la carte projet
const project: Project = {
  id: "project-1",
  name: "Application mobile",
  description: "Suivi des tâches de l'équipe",
  ownerId: "user-1",
  owner: {
    id: "user-1",
    email: "owner@example.com",
    name: "Marie Dupont",
    createdAt: "2026-07-09T00:00:00.000Z",
  },
  members: [],
  _count: {
    tasks: 4,
  },
  completedTasks: 2,
  userRole: "OWNER",
  createdAt: "2026-07-09T00:00:00.000Z",
  updatedAt: "2026-07-09T00:00:00.000Z",
};

// composant de test qui rend visible le résultat du clic sur modifier
function EditableProjectCard() {
  const [selectedProjectName, setSelectedProjectName] = useState("Aucun projet");

  return (
    <>
      <CardProject
        project={project}
        onEdit={(selectedProject) => setSelectedProjectName(selectedProject.name)}
      />
      <p>Projet sélectionné : {selectedProjectName}</p>
    </>
  );
}

test("met à jour le compteur après un clic sur le bouton", () => {
  render(<ClickCounter />);
  fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));
  expect(screen.getByText("Compteur : 1")).toBeDefined();
});

test("ne met pas à jour le compteur après un clic sur un bouton désactivé", () => {
  render(<DisabledCounter />);
  fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));
  expect(screen.getByText("Compteur : 0")).toBeDefined();
});

test("active la vue kanban après un clic sur l'onglet kanban", () => {
  render(<DashboardViewSelector />);
  fireEvent.click(screen.getByRole("button", { name: "Kanban" }));
  expect(screen.getByText("Vue active : kanban")).toBeDefined();
  expect(
    screen.getByRole("button", { name: "Kanban" }).getAttribute("aria-pressed")
  ).toBe("true");
});

test("sélectionne le projet après un clic sur son bouton modifier", () => {
  render(<EditableProjectCard />);
  fireEvent.click(
    screen.getByRole("button", { name: "Modifier le projet Application mobile" })
  );
  expect(
    screen.getByText("Projet sélectionné : Application mobile")
  ).toBeDefined();
});