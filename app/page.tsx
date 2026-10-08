import StarsButton from "./components/StarsButton";

// demo ao vivo: o mesmo endpoint que os READMEs usam
const PREVIEW_DARK = "/api/painel/lucasfdigital";
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
    title: "Atualiza a cada 4h",
    desc: "O painel é montado na hora com seus dados. Nada roda na sua conta.",
  },
  {
    title: "Nada seu guardado",
    desc: "Só dados públicos do GitHub. Sem banco, sem token salvo.",
  },
  {
    title: "Animações suaves",
    desc: "SVG com SMIL + CSS que o GitHub toca direto no perfil.",
  },
  {
    title: "Do seu jeito",
    desc: "Tire repos das linguagens com ?excluir=repo1,repo2 na URL da imagem. MIT, faça o que quiser.",
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
          KPIs, linguagens e calendário com seus dados reais. O site coloca o
          painel no README do seu perfil e ele se atualiza sozinho a cada 4
          horas.
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
          <li>✓ Atualiza a cada 4h</li>
          <li>✓ Nada roda na sua conta</li>
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
            ["Conecte o GitHub", "Login OAuth pedindo só o necessário: editar o README do seu repo de perfil."],
            ["Colocamos o painel", "No README de seu-user/seu-user (criamos o repo se não existir). O resto do README fica igual."],
            ["Abra seu perfil", "O painel aparece na hora e se atualiza sozinho a cada 4 horas."],
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
          editar o README e apagado ao concluir. Não temos banco: o painel é
          montado na hora com os seus dados públicos do GitHub. Para parar,
          é só apagar o bloco do painel do seu README. Todo o código é aberto
          (MIT) e está no GitHub para auditar.
        </p>

        <h2 className="mt-20 text-3xl font-bold">Prefere sem login?</h2>
        <p className="mt-4 max-w-2xl text-center text-zinc-400">
          Cole isto no README do seu repo de perfil (troque{" "}
          <code className="text-zinc-200">SEU-USER</code>):
        </p>
        <pre className="mt-4 w-full max-w-2xl overflow-x-auto rounded-xl border border-white/10 bg-[#131318] p-4 text-left text-xs text-zinc-300">
          {`<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://github-profile-dash.vercel.app/api/painel/SEU-USER">
<img src="https://github-profile-dash.vercel.app/api/painel/SEU-USER?tema=claro" width="860" />
</picture>`}
        </pre>

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
