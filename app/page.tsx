import StarsButton from "./components/StarsButton";

const PREVIEW_DARK =
  "https://raw.githubusercontent.com/lucasfdigital/github-profile-dashboard/main/profile-top.svg";
const TEMPLATE = "https://github.com/lucasfdigital/github-profile-dashboard";

const FEATURES = [
  {
    title: "Dados reais",
    desc: "KPIs, gráfico mensal, linguagens com cores oficiais e calendário — tudo da sua conta.",
  },
  {
    title: "Dark + light",
    desc: "O README troca sozinho conforme o tema de quem visita seu perfil.",
  },
  {
    title: "Cron de 4h",
    desc: "Atualiza sozinho na sua conta, na quota gratuita. Sem servidor no caminho.",
  },
  {
    title: "Sem token",
    desc: "Só API pública do GitHub. Nada seu fica com a gente.",
  },
  {
    title: "Animações suaves",
    desc: "SVG com SMIL + CSS que o GitHub toca direto no perfil.",
  },
  {
    title: "Do seu jeito",
    desc: "dashboard.json liga/desliga seções e exclui repos. MIT, faça o que quiser.",
  },
];

export default function Home() {
  return (
    <main id="topo">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0b0e]/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
          <a href="#topo" className="font-bold">
            ◉ profile-dashboard
          </a>
          <div className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
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
              href={TEMPLATE}
              className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/10 sm:block"
            >
              GitHub
            </a>
            <a
              href="/api/auth/login"
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Conectar
            </a>
          </div>
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-16">
        <p className="text-sm text-zinc-400">
          Dashboard animado pro seu perfil do GitHub
        </p>
        <h1 className="mt-4 text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Conecte e ganhe
          <br />
          um README vivo
        </h1>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-400">
          KPIs, linguagens e calendário com seus dados reais. O site cria o
          repo na sua conta com cron de 4h — depois disso, nada depende da
          gente.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/api/auth/login"
            className="rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400"
          >
            Conectar GitHub
          </a>
          <a
            href={TEMPLATE}
            className="rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-lg text-zinc-200 transition hover:bg-white/10"
          >
            Ver template
          </a>
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-zinc-400">
          <li>✓ Sem token</li>
          <li>✓ Zero servidor depois do setup</li>
          <li>✓ 100% open source (MIT)</li>
        </ul>

        <div className="mt-12 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#131318] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PREVIEW_DARK}
            alt="Demonstração do dashboard com KPIs, gráfico mensal, linguagens e calendário"
            className="w-full"
          />
        </div>

        <h2 id="recursos" className="mt-20 scroll-mt-24 text-3xl font-bold">
          Feito pra mostrar seu ano
        </h2>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <section
              key={f.title}
              className="rounded-2xl border border-white/10 bg-[#131318] p-5"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
            </section>
          ))}
        </div>

        <h2
          id="como-funciona"
          className="mt-20 scroll-mt-24 text-3xl font-bold"
        >
          Como funciona
        </h2>
        <ol className="mt-8 w-full max-w-2xl space-y-4">
          {[
            ["Conecte o GitHub", "Login OAuth pedindo só o necessário: criar o repo e disparar o workflow."],
            ["Geramos seu repo", "Criamos seu-user/seu-user a partir do template, com scripts + cron + README."],
            ["Abra seu perfil", "A primeira atualização roda em ~2 min. Depois, o cron atualiza sozinho a cada 4h."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-black">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-zinc-400">{d}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 id="privacidade" className="mt-20 scroll-mt-24 text-3xl font-bold">
          Privacidade de verdade
        </h2>
        <p className="mt-4 max-w-2xl text-center text-zinc-400">
          O token do GitHub vive <strong className="text-zinc-200">30 minutos</strong> em
          cookie httpOnly, é usado <strong className="text-zinc-200">uma única vez</strong> para
          criar o repo e apagado ao concluir. Seus dados de contribuição nunca
          passam pelo nosso banco — porque não temos banco. Todo o código é
          aberto (MIT) e está no GitHub para auditar.
        </p>

        <h2 className="mt-20 text-3xl font-bold">Prefere manual?</h2>
        <p className="mt-4 max-w-2xl text-center text-zinc-400">
          Use o template direto:{" "}
          <a className="text-emerald-400 underline" href={TEMPLATE}>
            Use this template
          </a>{" "}
          → crie o repo com seu username → aguarde o Actions. Sem site, sem
          login.
        </p>

        <footer className="mt-16 text-center text-sm text-zinc-500">
          <p>
            Crafted by{" "}
            <a className="underline" href="https://github.com/lucasfdigital">
              Lucas Fernandes
            </a>
          </p>
          <p className="mt-1">
            Open source (MIT) ·{" "}
            <a className="underline" href={TEMPLATE}>
              código no GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
