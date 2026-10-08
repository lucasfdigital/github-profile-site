"use client";

import { useSearchParams } from "next/navigation";

export default function Conteudo() {
  const user = useSearchParams().get("user") ?? "";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-6 py-16 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 text-3xl font-bold">Dashboard no ar!</h1>
      <p className="mt-2 text-zinc-400">
        O README de <code className="text-zinc-200">{user}/{user}</code> já
        mostra o painel. Os dados se atualizam sozinhos a cada 4 horas.
      </p>
      <a
        href={`https://github.com/${user}`}
        className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400"
      >
        Ver meu perfil
      </a>
      {user && (
        <div className="mt-8 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#131318] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/painel/${encodeURIComponent(user)}`}
            alt={`Dashboard GitHub de ${user}`}
            className="w-full"
          />
        </div>
      )}
      {user && (
        <p className="mt-4 text-sm text-zinc-400">
          Sua página para compartilhar:{" "}
          <a href={`/${user}`} className="text-emerald-400 underline-offset-4 hover:underline">
            github-profile-dash.vercel.app/{user}
          </a>
        </p>
      )}
      <p className="mt-4 text-xs text-zinc-500">
        Não apareceu de primeira? Hard refresh (Ctrl/Cmd + Shift + R) — é o
        cache de imagens do GitHub.
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        Para parar de usar, apague do seu README o bloco entre{" "}
        <code>github-profile-dash:inicio</code> e{" "}
        <code>github-profile-dash:fim</code>.
      </p>
    </main>
  );
}
