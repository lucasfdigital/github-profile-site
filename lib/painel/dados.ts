import { cacheLife } from "next/cache";
import type { Contribuicoes, Dia, Estatisticas } from "./render";

// Uma consulta só: calendário dos últimos 12 meses + os 2 anos fechados
// anteriores (para o comparativo anual e o recorde de streak), repos
// públicos com linguagens/stars e total de PRs.
const CONSULTA = `query Painel($login: String!, $de1: DateTime!, $ate1: DateTime!, $de2: DateTime!, $ate2: DateTime!) {
  user(login: $login) {
    login
    recente: contributionsCollection { ...Calendario }
    ano1: contributionsCollection(from: $de1, to: $ate1) { ...Calendario }
    ano2: contributionsCollection(from: $de2, to: $ate2) { ...Calendario }
    pullRequests { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name } }
        }
      }
    }
  }
}
fragment Calendario on ContributionsCollection {
  contributionCalendar {
    totalContributions
    weeks { contributionDays { date contributionCount contributionLevel } }
  }
}`;

type Calendario = {
  contributionCalendar: {
    totalContributions: number;
    weeks: {
      contributionDays: {
        date: string;
        contributionCount: number;
        contributionLevel: string;
      }[];
    }[];
  };
};

type Repo = {
  name: string;
  stargazerCount: number;
  languages: { edges: { size: number; node: { name: string } }[] } | null;
};

export type RespostaUsuario = {
  login: string;
  recente: Calendario;
  ano1: Calendario;
  ano2: Calendario;
  pullRequests: { totalCount: number };
  repositories: { totalCount: number; nodes: Repo[] };
};

export type DadosPainel = { contrib: Contribuicoes; stats: Estatisticas };

const NIVEIS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// mesmos limites do script Python
const MAX_REPOS_LINGUAGENS = 30;
const MAX_LINGUAGENS = 8;

/** Junta os calendários e calcula os números derivados (port de
 *  scripts/fetch_contributions.py). */
export function montarContribuicoes(u: RespostaUsuario, ano: number): Contribuicoes {
  const porData = new Map<string, Dia>();
  const juntar = (c: Calendario, soAno?: string) => {
    for (const w of c.contributionCalendar.weeks) {
      for (const d of w.contributionDays) {
        if (soAno && !d.date.startsWith(soAno)) continue;
        porData.set(d.date, {
          date: d.date,
          count: d.contributionCount,
          level: NIVEIS[d.contributionLevel] ?? 0,
        });
      }
    }
  };
  // anos fechados primeiro; os últimos 12 meses ganham na sobreposição
  juntar(u.ano1, String(ano - 1));
  juntar(u.ano2, String(ano - 2));
  juntar(u.recente);
  const days = [...porData.values()].sort((a, b) => (a.date < b.date ? -1 : 1));

  let best: Dia | null = null;
  for (const d of days) if (!best || d.count > best.count) best = d;

  // streaks: dias seguidos com contribuição
  let longest = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of days) {
    const cur = Date.parse(`${d.date}T00:00:00Z`);
    if (d.count > 0) {
      run = prev !== null && cur - prev === 86400000 ? run + 1 : 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    prev = cur;
  }
  // streak atual: anda de trás pra frente; hoje vazio não quebra
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1;
    else if (i === days.length - 1) continue;
    else break;
  }

  const monthly: Record<string, number> = {};
  const yearly: Record<string, number> = {};
  for (const d of days) {
    monthly[d.date.slice(0, 7)] = (monthly[d.date.slice(0, 7)] ?? 0) + d.count;
    yearly[d.date.slice(0, 4)] = (yearly[d.date.slice(0, 4)] ?? 0) + d.count;
  }

  return {
    username: u.login,
    total_last_year: u.recente.contributionCalendar.totalContributions,
    days,
    stats: {
      current_streak: current,
      longest_streak: longest,
      best_day: best?.date ?? null,
      best_day_count: best?.count ?? 0,
      monthly_totals: monthly,
      yearly_totals: yearly,
    },
  };
}

/** Linguagens, stars e PRs (port de scripts/fetch_github_stats.py).
 *  `excluir` = nomes de repos que não entram (docs, playground...). */
export function montarEstatisticas(u: RespostaUsuario, excluir: string[]): Estatisticas {
  const fora = new Set(excluir.map((n) => n.toLowerCase()));
  const nodes = u.repositories.nodes.filter(Boolean);
  const own = nodes.filter((r) => !fora.has(r.name.toLowerCase()));
  const stars = own.reduce((s, r) => s + (r.stargazerCount ?? 0), 0);

  const bytes = new Map<string, number>();
  for (const r of own.slice(0, MAX_REPOS_LINGUAGENS)) {
    for (const e of r.languages?.edges ?? []) {
      bytes.set(e.node.name, (bytes.get(e.node.name) ?? 0) + e.size);
    }
  }
  const total = [...bytes.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...bytes.entries()]
    .map(([name, b]) => ({ name, bytes: b, pct: Math.round((b / total) * 1000) / 10 }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, MAX_LINGUAGENS);

  return {
    repo_count: u.repositories.totalCount - (nodes.length - own.length),
    stars,
    prs: u.pullRequests.totalCount,
    languages,
  };
}

/** Busca e monta os dados do painel. `hoje` (AAAA-MM-DD) entra na chave do
 *  cache. Devolve null se o usuário não existe. Cache de 4h por instância;
 *  o cache principal é o da CDN (Cache-Control da rota). */
export async function buscarDadosPainel(
  login: string,
  excluir: string[],
  hoje: string,
): Promise<DadosPainel | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 4 * 60 * 60, expire: 24 * 60 * 60 });

  // o build de produção esconde a mensagem de erros lançados aqui dentro;
  // loga antes para o motivo aparecer nos logs da Vercel
  const falha = (msg: string) => {
    console.error(`painel ${login}: ${msg}`);
    return new Error(msg);
  };
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw falha("GITHUB_TOKEN não configurado na Vercel");
  const ano = Number(hoje.slice(0, 4));
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-profile-dash",
    },
    body: JSON.stringify({
      query: CONSULTA,
      variables: {
        login,
        de1: `${ano - 1}-01-01T00:00:00Z`,
        ate1: `${ano - 1}-12-31T23:59:59Z`,
        de2: `${ano - 2}-01-01T00:00:00Z`,
        ate2: `${ano - 2}-12-31T23:59:59Z`,
      },
    }),
    signal: AbortSignal.timeout(20000),
  }).catch((e: unknown) => {
    throw falha(`GitHub GraphQL: ${e instanceof Error ? e.message : String(e)}`);
  });
  if (!r.ok) throw falha(`GitHub GraphQL: HTTP ${r.status}`);
  const j = (await r.json()) as {
    data?: { user: RespostaUsuario | null };
    errors?: { type?: string; message: string }[];
  };
  if (j.errors?.some((e) => e.type === "NOT_FOUND") || j.data?.user === null) {
    return null;
  }
  if (j.errors?.length || !j.data?.user) {
    throw falha(`GitHub GraphQL: ${j.errors?.map((e) => e.message).join("; ")}`);
  }
  return {
    contrib: montarContribuicoes(j.data.user, ano),
    stats: montarEstatisticas(j.data.user, excluir),
  };
}
