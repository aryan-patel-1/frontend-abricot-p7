import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Tag from "@/app/components/tag";

test("affiche le libellé du statut en cours", () => {
  // render affiche le composant comme il apparaîtrait dans le navigateur
  render(<Tag status="progress" />);

  // le test vérifie le texte visible au lieu de lire l'état interne du composant
  expect(screen.getByText("EN COURS")).toBeDefined();
});
