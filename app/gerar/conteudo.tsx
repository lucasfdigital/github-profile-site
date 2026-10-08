import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { gh } from "@/lib/github";

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-6 py-16">
      <h1 className="text-3xl font-bold">Quase lá, {me.login} 👋</h1>
      <p className="mt-2 text-center text-zinc-400">
        Vou colocar o painel no README do repo{" "}
        <code className="text-zinc-200">{me.login}/{me.login}</code> (crio o
        repo se ele não existir). Se já tiver um README, o painel entra no topo
        e o resto fica igual.
      </p>
      {erro === "privado" && (
        <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          Seu repo <code>{me.login}/{me.login}</code> é privado, e o GitHub só
          mostra o README de perfil em repo público. Torne-o público (Settings →
          Change visibility) e tente de novo.
        </p>
      )}
      {(erro === "setup" || erro === "github") && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Falhou ao configurar o repo ({erro}). Tenta de novo em 1 minuto.
        </p>
      )}
      <form action="/api/generate" method="POST" className="mt-8 w-full">
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400"
        >
          Criar meu dashboard
        </button>
      </form>
      <p className="mt-4 text-xs text-zinc-500">
        Permissão usada uma única vez: criar/editar o README do seu repo de
        perfil (só repos públicos). O token expira em 30 minutos e não é
        guardado.
      </p>
    </main>
  );
}
