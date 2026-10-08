import type { ReactNode } from "react";
import StarsButton from "./components/StarsButton";
import PreviewPainel from "./components/PreviewPainel";
import CodigoReadme from "./components/CodigoReadme";

const TEMPLATE = "https://github.com/lucasfdigital/github-profile-dashboard";
const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://github-profile-dash.vercel.app").replace(/\/$/, "");

// ícones simples (traço branco), no mesmo espírito dos ícones do painel
const ic = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const ICONES = {
  grafico: ic(<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />),
  tema: ic(<><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="#fff" /></>),
  relogio: ic(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  cadeado: ic(<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  brilho: ic(<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />),
  ajuste: ic(<><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>),
};

// mesmos degradês dos ícones do painel
const TONS: Record<string, string> = {
  emerald: "from-[#10B981] to-[#059669]",
  purple: "from-[#A855F7] to-[#9333EA]",
  blue: "from-[#3B82F6] to-[#2563EB]",
  orange: "from-[#FB923C] to-[#F97316]",
  sky: "from-[#38BDF8] to-[#0284C7]",
  yellow: "from-[#EAB308] to-[#CA8A04]",
};

const FEATURES: { title: string; desc: string; icone: keyof typeof ICONES; tom: string }[] = [
  {
    title: "Dados reais",
    desc: "KPIs, gráfico mensal, linguagens com cores oficiais e calendário — tudo da sua conta.",
    icone: "grafico",
    tom: "emerald",
  },
  {
    title: "Dark + light",
    desc: "O README troca sozinho conforme o tema de quem visita seu perfil.",
    icone: "tema",
    tom: "purple",
  },
  {
    title: "Atualiza a cada 4h",
    desc: "O painel é montado na hora com seus dados. Nada roda na sua conta.",
    icone: "relogio",
    tom: "blue",
  },
  {
    title: "Nada seu guardado",
    desc: "Só dados públicos do GitHub. Sem banco, sem token salvo.",
    icone: "cadeado",
    tom: "orange",
  },
  {
    title: "Animações suaves",
    desc: "SVG com CSS que o GitHub toca direto no perfil.",
    icone: "brilho",
    tom: "sky",
  },
  {
    title: "Do seu jeito",
    desc: "Tire repos das linguagens com ?excluir=repo1,repo2 na URL da imagem. MIT, faça o que quiser.",
    icone: "ajuste",
    tom: "yellow",
  },
];

const PASSOS = [
  ["Conecte o GitHub", "Login pedindo só o necessário: editar o README do seu repo de perfil."],
  ["Colocamos o painel", "No README de seu-user/seu-user (criamos o repo se não existir). O resto fica igual."],
  ["Abra seu perfil", "O painel aparece na hora e se atualiza sozinho a cada 4 horas."],
];

const PRIVACIDADE = [
  ["Token de uso único", "Vive 30 minutos em cookie httpOnly e é apagado ao concluir."],
  ["Sem banco de dados", "O painel é montado na hora com os seus dados públicos."],
  ["Sai quando quiser", "Apague o bloco do painel do seu README e pronto."],
  ["Código aberto", "MIT, no GitHub, para qualquer um auditar."],
];

function Titulo({ id, children, sub }: { id?: string; children: ReactNode; sub?: string }) {
  return (
    <div className="mt-24 text-center">
      <h2 id={id} className="scroll-mt-24 text-3xl font-bold tracking-tight">
        {children}
      </h2>
      {sub && <p className="mt-2 text-zinc-400">{sub}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main id="topo" className="relative isolate overflow-x-clip">
      {/* brilho verde atrás do topo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(16,185,129,0.20),transparent)]"
      />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0b0e]/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#topo" className="flex items-center gap-2 font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-b from-[#10B981] to-[#059669] text-[10px] text-white">
              ●
            </span>
            profile-dashboard
          </a>
          <div className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#experimente" className="transition hover:text-white">
              Experimente
            </a>
            <a href="#recursos" className="transition hover:text-white">
              Recursos
            </a>
            <a href="#como-funciona" className="transition hover:text-white">
              Como funciona
            </a>
            <a href="#privacidade" className="transition hover:text-white">
              Privacidade
            </a>
          </div>
          <div className="flex items-center gap-2">
            <StarsButton repo="lucasfdigital/github-profile-dashboard" />
            <a
              href="/api/auth/login"
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Conectar
            </a>
          </div>
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Atualiza sozinho a cada 4 horas
        </p>
        <h1 className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Conecte e ganhe
          <br />
          um README <span className="text-emerald-400">vivo</span>
        </h1>
        <p className="mt-5 max-w-2xl text-center text-lg text-zinc-400">
          KPIs, linguagens e calendário com seus dados reais, direto no seu
          perfil do GitHub. Sem robô, sem token guardado.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href="/api/auth/login"
            className="rounded-xl bg-emerald-500 px-8 py-3 text-center text-lg font-semibold text-black shadow-[0_0_40px_-10px_rgba(16,185,129,0.8)] transition hover:bg-emerald-400"
          >
            Conectar GitHub
          </a>
          <a
            href="#experimente"
            className="rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-center text-lg text-zinc-200 transition hover:bg-white/10"
          >
            Ver um exemplo
          </a>
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-zinc-400">
          <li>✓ Grátis</li>
          <li>✓ Nada roda na sua conta</li>
          <li>✓ 100% open source (MIT)</li>
        </ul>

        <div id="experimente" className="mt-14 w-full scroll-mt-24">
          <p className="mb-3 text-center text-sm text-zinc-400">
            Veja o painel de qualquer pessoa — digite um usuário do GitHub:
          </p>
          <PreviewPainel inicial="lucasfdigital" />
        </div>

        <Titulo id="recursos" sub="Tudo que aparece no seu perfil, montado com os seus números.">
          Feito pra mostrar seu ano
        </Titulo>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <section
              key={f.title}
              className="rounded-2xl border border-white/10 bg-[#131318] p-5 transition hover:border-white/20"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-b ${TONS[f.tom]}`}>
                {ICONES[f.icone]}
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
            </section>
          ))}
        </div>

        <Titulo id="como-funciona" sub="Leva menos de um minuto.">
          Como funciona
        </Titulo>
        <ol className="mt-8 grid w-full gap-4 sm:grid-cols-3">
          {PASSOS.map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-white/10 bg-[#131318] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-bold text-black">
                {i + 1}
              </span>
              <p className="mt-4 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-zinc-400">{d}</p>
            </li>
          ))}
        </ol>
        <a
          href="/api/auth/login"
          className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400"
        >
          Conectar GitHub
        </a>

        <Titulo id="privacidade" sub="O mínimo de acesso, pelo menor tempo possível.">
          Privacidade de verdade
        </Titulo>
        <ul className="mt-8 grid w-full gap-4 sm:grid-cols-2">
          {PRIVACIDADE.map(([t, d]) => (
            <li key={t} className="flex gap-3 rounded-2xl border border-white/10 bg-[#131318] p-5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-400">
                ✓
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm text-zinc-400">{d}</p>
              </div>
            </li>
          ))}
        </ul>

        <Titulo sub="Digite seu usuário, copie e cole no README do seu repo de perfil.">
          Prefere sem login?
        </Titulo>
        <div className="mt-8 flex w-full justify-center">
          <CodigoReadme base={BASE} />
        </div>

        <footer className="mt-24 w-full border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
          <p>
            Feito por{" "}
            <a className="text-zinc-300 underline-offset-4 hover:underline" href="https://github.com/lucasfdigital">
              Lucas Fernandes
            </a>{" "}
            · Open source (MIT) ·{" "}
            <a className="text-zinc-300 underline-offset-4 hover:underline" href={TEMPLATE}>
              código no GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
