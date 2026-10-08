import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { gh } from "@/lib/github";
import OpcoesPainel from "./OpcoesPainel";

export default async function Conteudo({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const token = (await cookies()).get("gh_token")?.value;
  if (!token) redirect("/");
  const me = (await (
    await gh("/user", token)
  ).json()) as { login: string };
  const { erro } = await searchParams;

  // repos públicos do usuário (mais recentes primeiro) para escolher quais
  // ficam fora das linguagens; forks já não contam
  const reposRes = await gh(
    "/user/repos?affiliation=owner&visibility=public&sort=pushed&per_page=100",
    token,
  );
  const repos = reposRes.ok
    ? ((await reposRes.json()) as { name: string; fork: boolean; language: string | null }[])
        .filter((r) => !r.fork)
        .map((r) => ({ name: r.name, language: r.language }))
    : [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Quase lá, {me.login} 👋</h1>
      <p className="mt-2 max-w-2xl text-center text-zinc-400">
        Escolha o que aparece e clique em criar. Vou colocar o painel no README
        do repo <code className="text-zinc-200">{me.login}/{me.login}</code>{" "}
        (crio o repo se ele não existir). Se já tiver um README, o painel entra
        no topo e o resto fica igual.
      </p>
      {erro === "privado" && (
        <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          Seu repo <code>{me.login}/{me.login}</code> é privado, e o GitHub só
          mostra o README de perfil em repo público. Torne-o público (Settings →
          Change visibility) e tente de novo.
        </p>
      )}
      {erro === "vazio" && (
        <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          Escolha pelo menos uma parte do painel.
        </p>
      )}
      {(erro === "setup" || erro === "github") && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Falhou ao configurar o repo ({erro}). Tenta de novo em 1 minuto.
        </p>
      )}
      <OpcoesPainel login={me.login} repos={repos} />
      <p className="mt-6 max-w-2xl text-center text-xs text-zinc-500">
        Permissão usada uma única vez: criar/editar o README do seu repo de
        perfil (só repos públicos). O token expira em 30 minutos e não é
        guardado. Dá pra mudar as escolhas depois: é só voltar aqui e criar de
        novo.
      </p>
    </main>
  );
}
