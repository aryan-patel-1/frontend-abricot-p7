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
      {/* simule un composant qui réagit à un clic utilisateur */}
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
      {/* vérifie qu'un bouton désactivé ne déclenche pas son action */}
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
      {/* expose la vue active pour pouvoir vérifier le changement après clic */}
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
      {/* garde le projet sélectionné visible pour vérifier l'action modifier */}
      <CardProject
        project={project}
        onEdit={(selectedProject) => setSelectedProjectName(selectedProject.name)}
      />
      <p>Projet sélectionné : {selectedProjectName}</p>
    </>
  );
}

test("met à jour le compteur après un clic sur le bouton", () => {
  // arrange: affiche le composant à tester
  render(<ClickCounter />);

  // act: simule le clic utilisateur sur le bouton visible
  fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

  // assert: vérifie que l'interface affiche le nouvel état
  expect(screen.getByText("Compteur : 1")).toBeDefined();
});

test("ne met pas à jour le compteur après un clic sur un bouton désactivé", () => {
  // arrange: affiche le même compteur avec un bouton disabled
  render(<DisabledCounter />);

  // act: tente un clic même si le bouton est désactivé
  fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

  // assert: le compteur doit rester à zéro
  expect(screen.getByText("Compteur : 0")).toBeDefined();
});

test("active la vue kanban après un clic sur l'onglet kanban", () => {
  // arrange: affiche les onglets avec la vue liste active au départ
  render(<DashboardViewSelector />);

  // act: clique sur l'onglet kanban comme un utilisateur
  fireEvent.click(screen.getByRole("button", { name: "Kanban" }));

  // assert: le texte visible confirme que l'état local a changé
  expect(screen.getByText("Vue active : kanban")).toBeDefined();
  // assert: aria-pressed confirme aussi l'état accessible du bouton
  expect(screen.getByRole("button", { name: "Kanban" }).getAttribute("aria-pressed")).toBe("true");
});

test("sélectionne le projet après un clic sur son bouton modifier", () => {
  // arrange: affiche une carte projet avec un handler onEdit contrôlé
  render(<EditableProjectCard />);

  // act: clique sur le bouton modifier de la carte
  fireEvent.click(
    screen.getByRole("button", { name: "Modifier le projet Application mobile" })
  );

  // assert: le nom affiché prouve que le bon projet a été transmis au handler
  expect(screen.getByText("Projet sélectionné : Application mobile")).toBeDefined();
});