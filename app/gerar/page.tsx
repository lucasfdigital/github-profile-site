import { Suspense } from "react";
import Conteudo from "./conteudo";

export default function Gerar({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  return (
    <Suspense fallback={<main className="px-6 py-16 text-center">Carregando…</main>}>
      <Conteudo searchParams={searchParams} />
    </Suspense>
  );
}
