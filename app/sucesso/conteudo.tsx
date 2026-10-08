"use client";

import { useSearchParams } from "next/navigation";
import StatusMonitor from "./StatusMonitor";

export default function Conteudo() {
  const repo = useSearchParams().get("repo") ?? "";
  const user = repo.split("/")[0];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-6 py-16 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 text-3xl font-bold">Dashboard criado!</h1>
      <p className="mt-2 text-zinc-400">
        O repo <code className="text-zinc-200">{repo}</code> foi gerado e a
        primeira atualização disparada (~2 min).
      </p>
      <a
        href={`https://github.com/${user}`}
        className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400"
      >
        Ver meu perfil
      </a>
      <StatusMonitor repo={repo} />
      <p className="mt-4 text-xs text-zinc-500">
        Não apareceu de primeira? Hard refresh (Ctrl/Cmd + Shift + R) — é o
        cache de imagens do GitHub.
      </p>
    </main>
  );
}
