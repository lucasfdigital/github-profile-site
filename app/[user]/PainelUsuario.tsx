"use client";

import { useState } from "react";

/** Painel grande de um usuário, com tema e botões de compartilhar. */
export default function PainelUsuario({ user }: { user: string }) {
  const [claro, setClaro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const src = `/api/painel/${user}${claro ? "?tema=claro" : ""}`;

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // sem permissão de área de transferência: o link continua na barra
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={`https://github.com/${user}`}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
        >
          Ver perfil no GitHub ↗
        </a>
        <button
          type="button"
          onClick={copiarLink}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
        >
          {copiado ? "Link copiado ✓" : "Copiar link desta página"}
        </button>
        <div className="inline-flex rounded-xl border border-white/10 bg-[#131318] p-0.5 text-sm">
          {[
            [false, "Escuro"],
            [true, "Claro"],
          ].map(([valor, nome]) => (
            <button
              key={String(nome)}
              type="button"
              aria-pressed={claro === valor}
              onClick={() => {
                if (claro !== valor) {
                  setCarregando(true);
                  setClaro(valor as boolean);
                }
              }}
              className={`rounded-lg px-3 py-1.5 transition ${
                claro === valor ? "bg-white/10 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {nome}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mx-auto mt-6 max-w-[900px] overflow-hidden rounded-2xl border p-2 transition-colors ${
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
      </div>
    </div>
  );
}
