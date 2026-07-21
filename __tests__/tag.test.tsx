import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Tag from "@/app/components/tag";

// vérifie le texte visible plutôt que les détails internes du composant
test("affiche le libellé du statut en cours", () => {
  render(<Tag status="progress" />);
  expect(screen.getByText("EN COURS")).toBeDefined();
});
