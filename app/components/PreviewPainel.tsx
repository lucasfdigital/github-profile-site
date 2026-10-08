"use client";

import { useState } from "react";

// mesma regra de username do GitHub usada na rota do painel
const USUARIO = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const limpar = (s: string) => s.trim().replace(/^@/, "");

/** Prévia ao vivo: digita um usuário e vê o painel dele, nos dois temas. */
export default function PreviewPainel({ inicial }: { inicial: string }) {
  const [texto, setTexto] = useState(inicial);
  const [user, setUser] = useState(inicial);
  const [claro, setClaro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const src = `/api/painel/${user}${claro ? "?tema=claro" : ""}`;
  const valido = USUARIO.test(limpar(texto));

  const trocar = (novoUser: string, novoClaro: boolean) => {
    if (novoUser === user && novoClaro === claro) return;
    // mantém o painel anterior apagado enquanto o novo carrega
    setCarregando(true);
    setUser(novoUser);
    setClaro(novoClaro);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valido) trocar(limpar(texto), claro);
        }}
        className="mx-auto flex w-full max-w-md gap-2"
      >
        <label className="flex flex-1 items-center rounded-xl border border-white/10 bg-[#131318] px-3 transition focus-within:border-emerald-500/60">
          <span className="text-zinc-500">@</span>
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-label="Usuário do GitHub"
            placeholder="seu-usuario"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-transparent px-1 py-2.5 text-zinc-100 outline-none placeholder:text-zinc-600"
          />
        </label>
        <button
          type="submit"
          disabled={!valido}
          className="rounded-xl bg-white/10 px-4 font-medium text-zinc-100 transition hover:bg-white/15 disabled:opacity-40"
        >
          Ver painel
        </button>
      </form>

      <div className="mt-3 flex justify-center">
        <div className="inline-flex rounded-lg border border-white/10 bg-[#131318] p-0.5 text-sm">
          {[
            [false, "Escuro"],
            [true, "Claro"],
          ].map(([valor, nome]) => (
            <button
              key={String(nome)}
              type="button"
              onClick={() => trocar(user, valor as boolean)}
              aria-pressed={claro === valor}
              className={`rounded-md px-3 py-1 transition ${
                claro === valor ? "bg-white/10 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {nome}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative mt-4 overflow-hidden rounded-2xl border p-2 transition-colors ${
          claro ? "border-zinc-200 bg-white" : "border-white/10 bg-[#0d0d11]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Dashboard GitHub de ${user}`}
          onLoad={() => setCarregando(false)}
          onError={() => setCarregando(false)}
          className={`w-full transition-opacity duration-300 ${carregando ? "opacity-40" : "opacity-100"}`}
        />
        {carregando && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
            carregando…
          </p>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-zinc-500">
        <a href={`/${user}`} className="underline hover:text-zinc-300">
          abrir a página de @{user} ↗
        </a>
      </p>
    </div>
  );
}
