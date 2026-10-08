"use client";

import { useEffect, useRef, useState } from "react";

type Step = "repo" | "readme" | "refresh";

const STEPS: { id: Step; label: string; hint: string }[] = [
  {
    id: "repo",
    label: "Repo criado",
    hint: "gerado a partir do template",
  },
  {
    id: "readme",
    label: "README do perfil",
    hint: "só o dashboard, sem documentação",
  },
  {
    id: "refresh",
    label: "Primeira atualização",
    hint: "robô gerando com seus dados",
  },
];

export default function StatusMonitor({ repo }: { repo: string }) {
  const [done, setDone] = useState<Record<Step, boolean>>({
    repo: true,
    readme: false,
    refresh: false,
  });
  const [stuck, setStuck] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    if (!repo || !repo.includes("/")) return;
    const id = setInterval(async () => {
      tries.current += 1;
      try {
        const r = await fetch(
          `https://api.github.com/repos/${repo}/commits?per_page=10`,
        );
        if (!r.ok) throw new Error("api");
        const commits = (await r.json()) as { commit: { message: string } }[];
        const msgs = commits.map((c) => c.commit.message).join("\n");
        const readme = /setup: README do perfil/.test(msgs);
        const refresh = /chore: refresh/.test(msgs);
        setDone({ repo: true, readme, refresh });
        if (readme && refresh) clearInterval(id);
      } catch {
        // tenta de novo no próximo ciclo
      }
      if (tries.current >= 40) {
        clearInterval(id);
        setStuck(true);
      }
    }, 15000);
    // primeira checagem imediata
    const kick = setTimeout(() => {
      tries.current += 1;
      fetch(`https://api.github.com/repos/${repo}/commits?per_page=10`)
        .then((r) => (r.ok ? r.json() : []))
        .then((commits: { commit: { message: string } }[]) => {
          const msgs = commits.map((c) => c.commit.message).join("\n");
          setDone({
            repo: true,
            readme: /setup: README do perfil/.test(msgs),
            refresh: /chore: refresh/.test(msgs),
          });
        })
        .catch(() => {});
    }, 2000);
    return () => {
      clearInterval(id);
      clearTimeout(kick);
    };
  }, [repo]);

  const allDone = done.readme && done.refresh;

  return (
    <div className="mt-8 w-full rounded-2xl border border-white/10 bg-[#131318] p-5 text-left">
      <p className="text-sm text-zinc-400">
        Acompanhando <code className="text-zinc-200">{repo}</code> (atualiza
        sozinho):
      </p>
      <ul className="mt-3 space-y-2">
        {STEPS.map((s) => (
          <li key={s.id} className="flex items-start gap-3">
            <span
              className={
                done[s.id]
                  ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-black"
                  : "flex h-6 w-6 shrink-0 animate-pulse items-center justify-center rounded-full border border-white/20 text-sm text-zinc-400"
              }
            >
              {done[s.id] ? "✓" : "…"}
            </span>
            <div>
              <p className={done[s.id] ? "text-zinc-100" : "text-zinc-400"}>
                {s.label}
              </p>
              <p className="text-xs text-zinc-500">{s.hint}</p>
            </div>
          </li>
        ))}
      </ul>
      {allDone && (
        <p className="mt-3 text-sm text-emerald-400">
          Pronto! Se o perfil ainda mostra o antigo, é cache: Ctrl/Cmd + Shift
          + R.
        </p>
      )}
      {stuck && !allDone && (
        <div className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          <p className="font-semibold">Travou no meio do caminho?</p>
          <p className="mt-1">
            Abre o repo → aba <strong>Actions</strong> →{" "}
            <em>Update profile art → Run workflow</em>. Isso conclui as etapas
            acima.
          </p>
        </div>
      )}
    </div>
  );
}
