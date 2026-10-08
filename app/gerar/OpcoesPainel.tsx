"use client";

import { useState } from "react";
import { SECOES, queryPainel, semConteudo } from "@/lib/painel/opcoes";

type Repo = { name: string; language: string | null };

/** Escolhas antes de criar: partes do painel e repos fora das linguagens,
 *  com a prévia do próprio painel mudando na hora. */
export default function OpcoesPainel({ login, repos }: { login: string; repos: Repo[] }) {
  const [ocultar, setOcultar] = useState<string[]>([]);
  const [excluir, setExcluir] = useState<string[]>([]);
  const [claro, setClaro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const opcoes = { ocultar: [...ocultar].sort(), excluir: [...excluir].sort() };
  const src = `/api/painel/${login}${queryPainel({ ...opcoes, claro })}`;
  const nada = semConteudo(ocultar);
  const mostraLinguagens = !ocultar.includes("linguagens");

  const alternar = (lista: string[], item: string, set: (v: string[]) => void) => {
    setCarregando(true);
    set(lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item]);
  };

  return (
    <form action="/api/generate" method="POST" className="mt-8 grid w-full gap-6 lg:grid-cols-[1fr_300px]">
      {opcoes.ocultar.map((id) => (
        <input key={id} type="hidden" name="ocultar" value={id} />
      ))}
      {mostraLinguagens &&
        opcoes.excluir.map((n) => <input key={n} type="hidden" name="excluir" value={n} />)}

      <div className="order-2 lg:order-1">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-zinc-400">Prévia do seu painel</span>
          <div className="inline-flex rounded-lg border border-white/10 bg-[#131318] p-0.5">
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
          className={`relative overflow-hidden rounded-2xl border p-2 transition-colors ${
            claro ? "border-zinc-200 bg-white" : "border-white/10 bg-[#0d0d11]"
          }`}
        >
          {nada ? (
            <p className="py-24 text-center text-sm text-zinc-500">Escolha pelo menos uma parte.</p>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Prévia do dashboard de ${login}`}
              onLoad={() => setCarregando(false)}
              onError={() => setCarregando(false)}
              className={`w-full transition-opacity duration-300 ${carregando ? "opacity-40" : "opacity-100"}`}
            />
          )}
        </div>
      </div>

      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <fieldset className="rounded-2xl border border-white/10 bg-[#131318] p-4">
          <legend className="px-1 text-sm font-semibold">O que mostrar</legend>
          <ul className="mt-1 space-y-1">
            {SECOES.map((s) => (
              <li key={s.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={!ocultar.includes(s.id)}
                    onChange={() => alternar(ocultar, s.id, setOcultar)}
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />
                  <span>
                    <span className="block text-sm">{s.nome}</span>
                    {s.desc && <span className="block text-xs text-zinc-500">{s.desc}</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {mostraLinguagens && repos.length > 0 && (
          <fieldset className="rounded-2xl border border-white/10 bg-[#131318] p-4">
            <legend className="px-1 text-sm font-semibold">Esconder das linguagens</legend>
            <p className="px-2 text-xs text-zinc-500">
              Marque repos que não representam seu código (docs, testes, forks antigos).
            </p>
            <ul className="mt-2 max-h-56 space-y-0.5 overflow-y-auto pr-1">
              {repos.map((r) => (
                <li key={r.name}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={excluir.includes(r.name)}
                      onChange={() => alternar(excluir, r.name, setExcluir)}
                      className="h-4 w-4 accent-emerald-500"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm">{r.name}</span>
                    {r.language && <span className="shrink-0 text-xs text-zinc-500">{r.language}</span>}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        <button
          type="submit"
          disabled={nada}
          className="w-full rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-40"
        >
          Criar meu dashboard
        </button>
      </div>
    </form>
  );
}
