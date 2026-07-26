import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import MainLayout from "@/app/main/layout";
import { logout } from "@/app/services/authServices";

const routerReplace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  usePathname: () => "/main/dashboard",
  useRouter: () => ({
    replace: routerReplace,
  }),
}));

afterEach(() => {
  cleanup();
  logout();
  routerReplace.mockClear();
});

test("redirige une page privée vers la page 404 sans session", async () => {
  render(
    <MainLayout>
      <p>Contenu privé</p>
    </MainLayout>
  );

  await waitFor(() => {
    expect(routerReplace).toHaveBeenCalledWith("/404");
  });
});
