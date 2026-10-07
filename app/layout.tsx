import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "github-profile-dashboard — dashboard animado pro seu perfil",
  description:
    "KPIs, linguagens e calendário com dados reais do GitHub. Sem token, sem servidor. Conecte e ganhe o README com cron.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
