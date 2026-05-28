"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Footer from "../components/footer";
import Menu from "../components/menu";

type MainLayoutProps = {
  children: ReactNode;
};

function getLayout(children: ReactNode, pathname: string) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-[#f9fafb]">
      <Menu pathname={pathname} />
      <main className="flex-1 bg-[#f9fafb]">{children}</main>
      <Footer />
    </div>
  );
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return getLayout(children, pathname);
}
