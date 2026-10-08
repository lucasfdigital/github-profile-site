import Link from "next/link";
import StarsButton from "./StarsButton";

/** Cabeçalho do site (home e páginas de usuário). */
export default function Topo() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0b0e]/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-b from-[#10B981] to-[#059669] text-[10px] text-white">
            ●
          </span>
          profile-dashboard
        </Link>
        <div className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <Link href="/#experimente" className="transition hover:text-white">
            Experimente
          </Link>
          <Link href="/#recursos" className="transition hover:text-white">
            Recursos
          </Link>
          <Link href="/#como-funciona" className="transition hover:text-white">
            Como funciona
          </Link>
          <Link href="/#privacidade" className="transition hover:text-white">
            Privacidade
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <StarsButton repo="lucasfdigital/github-profile-dashboard" />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- rota de API: navegação completa, sem prefetch */}
          <a
            href="/api/auth/login"
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            Conectar
          </a>
        </div>
      </nav>
    </header>
  );
}
