import { Suspense } from "react";
import Conteudo from "./conteudo";
import Topo from "../components/Topo";

export default function Gerar({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  return (
    <>
      <Topo />
      <Suspense fallback={<main className="px-6 py-16 text-center">Carregando…</main>}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </>
  );
}
