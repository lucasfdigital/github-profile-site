const PREVIEW_DARK =
  "https://raw.githubusercontent.com/lucasfdigital/github-profile-dashboard/main/profile-top.svg";

const FEATURES = [
  {
    title: "Sem token",
    desc: "Só dados públicos da API do GitHub. Nada seu fica com a gente.",
  },
  {
    title: "Dark + light",
    desc: "O README troca sozinho conforme o tema de quem visita.",
  },
  {
    title: "Cron de 4h",
    desc: "Roda na sua conta, na quota gratuita. Sem servidor nosso no caminho.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 py-16">
      <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-400">
        template + cron, zero servidor
      </p>
      <h1 className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-6xl">
        Dashboard animado
        <br />
        pro seu perfil do GitHub
      </h1>
      <p className="mt-4 max-w-2xl text-center text-lg text-zinc-400">
        KPIs, gráfico mensal, linguagens e calendário com seus dados reais.
        Conecte o GitHub e receba o repo pronto com README + cron.
      </p>
      <a
        href="/api/auth/login"
        className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-400"
      >
        Conectar GitHub
      </a>

      <div className="mt-12 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#131318] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PREVIEW_DARK}
          alt="Prévia do dashboard com KPIs, gráfico mensal, linguagens e calendário"
          className="w-full"
        />
      </div>

      <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <section
            key={f.title}
            className="rounded-2xl border border-white/10 bg-[#131318] p-5"
          >
            <h2 className="text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
          </section>
        ))}
      </div>

      <ol className="mt-12 w-full max-w-2xl list-decimal space-y-2 pl-6 text-zinc-300">
        <li>Conecte o GitHub (scopes: criar repo + disparar workflow).</li>
        <li>Criamos o repo seu-user/seu-user a partir do template.</li>
        <li>Disparamos a primeira atualização. Abra seu perfil. 🎉</li>
      </ol>

      <footer className="mt-16 text-sm text-zinc-500">
        MIT · feito a partir de{" "}
        <a
          className="underline"
          href="https://github.com/lucasfdigital/github-profile-dashboard"
        >
          github-profile-dashboard
        </a>
      </footer>
    </main>
  );
}
