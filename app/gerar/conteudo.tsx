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
        Vou criar o repo <code className="text-zinc-200">{me.login}/{me.login}</code> a
        partir do template e disparar a primeira atualização.
      </p>
      {erro === "existe" && (
        <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          Você já tem o repo <code>{me.login}/{me.login}</code> e ele não veio
          deste template — não mexi nele. Renomeie esse repo (Settings →
          Repository name) e tente de novo.
        </p>
      )}
      {(erro === "setup" || erro === "github") && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Falhou ao configurar o repo ({erro}). Tenta de novo em 1 minuto — se
          persistir, cria pelo template manual: github.com/lucasfdigital/github-profile-dashboard
          → Use this template.
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
        Scopes usados uma única vez: criar o repo e disparar o workflow. O token
        expira em 30 minutos e não é guardado.
      </p>
    </main>
  );
}
