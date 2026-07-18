import type { Metadata } from "next";
import "./globals.css";
import "./reset.css";

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
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
