import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "github-profile-dashboard — dashboard animado pro seu perfil",
  description:
    "KPIs, linguagens e calendário com dados reais do GitHub, atualizados sozinhos a cada 4 horas. Conecte e ganhe o painel no README do seu perfil.",
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
