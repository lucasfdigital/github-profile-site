import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Topo from "../components/Topo";
import PainelUsuario from "./PainelUsuario";

// mesma regra de username do GitHub usada na rota do painel
const USUARIO = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

type Props = { params: Promise<{ user: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await params;
  if (!USUARIO.test(user)) return { title: "Página não encontrada — profile-dashboard" };
  return {
    title: `@${user} — painel do GitHub`,
    description: `Contribuições, linguagens e calendário de @${user}, atualizados a cada 4 horas.`,
  };
}

/** Página pública de um usuário: /lucasfdigital */
export default function PaginaUsuario({ params }: Props) {
  return (
    <main className="relative isolate overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(16,185,129,0.16),transparent)]"
      />
      <Topo />
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-12 sm:px-6">
        <Suspense fallback={<p className="py-24 text-zinc-500">Carregando…</p>}>
          <Conteudo params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function Conteudo({ params }: Props) {
  const { user } = await params;
  if (!USUARIO.test(user)) notFound();

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://github.com/${user}.png?size=160`}
        alt=""
        width={80}
        height={80}
        className="h-20 w-20 rounded-full border border-white/10"
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">@{user}</h1>
      <p className="mt-2 text-center text-zinc-400">
        Painel do GitHub, atualizado sozinho a cada 4 horas.
      </p>
      <div className="mt-6 w-full">
        <PainelUsuario user={user} />
      </div>
      <div className="mt-10 rounded-2xl border border-white/10 bg-[#131318] p-6 text-center">
        <p className="font-semibold">Quer um assim no seu perfil?</p>
        <p className="mt-1 text-sm text-zinc-400">Leva menos de um minuto e nada roda na sua conta.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- rota de API: navegação completa, sem prefetch */}
        <a
          href="/api/auth/login"
          className="mt-4 inline-block rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-black transition hover:bg-emerald-400"
        >
          Criar o meu painel
        </a>
      </div>
    </>
  );
}
