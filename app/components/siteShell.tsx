//sert à ajouter le menu et le footer sur les pages qui en ont besoin, en fonction de l'url

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Footer from "./footer";
import Menu from "./menu";

type SiteShellProps = {
  children: ReactNode;
};

const routesWithShell = ["/account", "/dashboard", "/projects"];

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const hasShell = routesWithShell.some((route) => pathname.startsWith(route));

  if (!hasShell) {
    return children;
  }

  return (
    // ajoute le menu et le footer
    <div className="site-shell">
      <Menu pathname={pathname} />
      <main className="site-shell-main">{children}</main>
      <Footer />
    </div>
  );
}