"use client";

import { useState } from "react";

/** Trecho para colar no README sem login, já com o usuário e botão copiar. */
export default function CodigoReadme({ base }: { base: string }) {
  const [user, setUser] = useState("");
  const [copiado, setCopiado] = useState(false);
  const u = user.trim().replace(/^@/, "") || "SEU-USER";
  const codigo = `<picture>
<source media="(prefers-color-scheme: dark)" srcset="${base}/api/painel/${u}">
<img src="${base}/api/painel/${u}?tema=claro" width="860" alt="Dashboard GitHub de ${u}" />
</picture>`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // sem permissão de área de transferência: o texto continua selecionável
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <label className="flex items-center rounded-xl border border-white/10 bg-[#131318] px-3 transition focus-within:border-emerald-500/60">
        <span className="text-zinc-500">@</span>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          aria-label="Seu usuário do GitHub"
          placeholder="seu-usuario"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-transparent px-1 py-2.5 text-zinc-100 outline-none placeholder:text-zinc-600"
        />
      </label>
      <div className="relative mt-3 rounded-xl border border-white/10 bg-[#131318]">
        <button
          type="button"
          onClick={copiar}
          className="absolute right-2 top-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 transition hover:bg-white/10"
        >
          {copiado ? "Copiado ✓" : "Copiar"}
        </button>
        <pre className="whitespace-pre-wrap break-all p-4 pr-24 text-left text-xs leading-relaxed text-zinc-300">
          {codigo}
        </pre>
      </div>
    </div>
  );
}
