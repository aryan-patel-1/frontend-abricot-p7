import type { Metadata } from "next";
import "./globals.css";
import "./reset.css";

// définit les métadonnées communes à toutes les routes de l'application
export const metadata: Metadata = {
  title: "Abricot",
  description: "Abricot",
  icons: {
    icon: "/img/logo-orange.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
