// Port fiel de scripts/render_profile_top.py (github-profile-dashboard):
// mesmo layout BoardUI, mesmas cores, mesmas animações. Recebe os dados no
// mesmo formato dos JSONs que o Python gerava (data/*.json).
import { medir } from "./fonte";

export type Dia = { date: string; count: number; level: number };

export type Contribuicoes = {
  username: string;
  total_last_year: number;
  days: Dia[];
  stats: {
    current_streak: number;
    longest_streak: number;
    best_day: string | null;
    best_day_count: number;
    monthly_totals: Record<string, number>;
    yearly_totals: Record<string, number>;
  };
};

export type Linguagem = { name: string; bytes: number; pct: number };

export type Estatisticas = {
  repo_count: number;
  stars: number | null;
  prs: number | null;
  languages: Linguagem[];
};

export type Logos = Record<string, { path: string; color?: string }>;

export type Secoes = {
  header: boolean;
  kpis: boolean;
  extras: boolean;
  chart: boolean;
  languages: boolean;
  heatmap: boolean;
};

export const TODAS_SECOES: Secoes = {
  header: true,
  kpis: true,
  extras: true,
  chart: true,
  languages: true,
  heatmap: true,
};

const W = 880;

const TEMAS = {
  // BoardUI light tokens
  claro: {
    CARD: "#FFFFFF",
    CARD_BORDER: "#E4E4E7",
    FG: "#18181B",
    SEC: "#52525B",
    TER: "#71717A",
    TRACK: "#F4F4F5",
    BAND: "#F4F4F5",
    NEU_BG: "#F4F4F5",
    LIME_BG: "#D9F99D",
    LIME_TXT: "#3F6212",
    ROSE_BG: "#FECDD3",
    ROSE_TXT: "#9F1239",
    HEAT: ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"],
    HEAT_TOP: "#216E39",
  },
  // BoardUI dark tokens
  escuro: {
    CARD: "#131318",
    CARD_BORDER: "rgba(255,255,255,0.08)",
    FG: "#FAFAFA",
    SEC: "#A1A1AA",
    TER: "#71717A",
    TRACK: "#232327",
    BAND: "#1A1A1F",
    NEU_BG: "#232327",
    LIME_BG: "#1A2E05",
    LIME_TXT: "#84CC16",
    ROSE_BG: "#4C0519",
    ROSE_TXT: "#F43F5E",
    HEAT: ["#161B22", "#0E4429", "#006D32", "#26A641", "#39D353"],
    HEAT_TOP: "#69F0A0",
  },
};

const ACCENT = "#10B981"; // chart-9-active / emerald

const TONES: Record<string, [string, string]> = {
  emerald: ["#10B981", "#059669"],
  blue: ["#3B82F6", "#2563EB"],
  purple: ["#A855F7", "#9333EA"],
  orange: ["#FB923C", "#F97316"],
  yellow: ["#EAB308", "#CA8A04"],
  sky: ["#38BDF8", "#0284C7"],
};

const FONT = "Inter,ui-sans-serif,system-ui,-apple-system,sans-serif";

const MESES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// GitHub linguist colors for common languages
const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5", JavaScript: "#F1E05A", TypeScript: "#3178C6",
  HTML: "#E34C26", CSS: "#563D7C", Shell: "#89E051",
  Dockerfile: "#384D54", Vue: "#41B883", Go: "#00ADD8",
  Rust: "#DEA584", Java: "#B07219", Ruby: "#701516",
  PHP: "#4F5D95", "C++": "#F34B7D", C: "#555555",
  "Jupyter Notebook": "#DA5B0B", MDX: "#FCB32C", SCSS: "#C6538C",
  Less: "#1D365D", Elixir: "#6E4A7E", Kotlin: "#A97BFF",
  Swift: "#F05138", Dart: "#00B4AB", R: "#198CE7",
  Lua: "#000080", HCL: "#844FBA", Makefile: "#427819",
};
const LANG_DEFAULT = "#8B949E";

// drawn tile glyphs (centered)
const GLYPHS: Record<string, string> = {
  "●": '<circle cx="0" cy="0" r="6" fill="#FFFFFF"/>',
  "▲": '<polygon points="0,-7 7,5 -7,5" fill="#FFFFFF"/>',
  "★": '<polygon points="0,-8 2.4,-2.6 8,-2.5 3.5,1.2 5,7 0,3.5 -5,7 -3.5,1.2 -8,-2.5 -2.4,-2.6" fill="#FFFFFF"/>',
  "◆": '<polygon points="0,-7 7,0 0,7 -7,0" fill="#FFFFFF"/>',
  PR: '<g fill="#FFFFFF"><circle cx="0" cy="-5" r="2.6"/><circle cx="0" cy="5" r="2.6"/><rect x="-1.1" y="-5" width="2.2" height="10"/></g>',
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** 3272 -> "3.272" (milhar com ponto, como o Python fazia). */
function fmt(n: number): string {
  const s = String(Math.trunc(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return n < 0 ? `-${s}` : s;
}

/** f"{x:.0f}" do Python: arredonda meio para o par (2.5 -> 2, 3.5 -> 4). */
function f0(x: number): string {
  const piso = Math.floor(x);
  const r = x - piso === 0.5 ? (piso % 2 === 0 ? piso : piso + 1) : Math.round(x);
  return String(r === 0 ? 0 : r);
}

/** str(float) do Python: 4.0 -> "4.0", 31.8 -> "31.8". */
function pyFloat(x: number): string {
  return Number.isInteger(x) ? `${x}.0` : String(x);
}

/** Pílula de variação: "+45%", "-12%" ou "×21" quando mais que dobrou.
 *  null quando não há base de comparação. */
function deltaChip(atual: number, anterior: number): [string, string] | null {
  if (anterior <= 0) return null;
  const razao = atual / anterior;
  const pct = (razao - 1) * 100;
  if (Math.abs(pct) < 0.5) return ["0%", "neutral"];
  if (razao >= 2) {
    const r = razao >= 10 ? String(Math.round(razao)) : razao.toFixed(1).replace(".", ",");
    return [`×${r}`, "lime"];
  }
  return [`${pct > 0 ? "+" : ""}${Math.round(pct)}%`, pct > 0 ? "lime" : "rose"];
}

/** Passo "redondo" para o eixo: 1, 2, 2.5 ou 5 × 10^n. */
function passoRedondo(bruto: number): number {
  const p = 10 ** Math.floor(Math.log10(Math.max(bruto, 1)));
  // 2,5 só a partir de 25 (evita passo quebrado em números pequenos)
  for (const m of p >= 10 ? [1, 2, 2.5, 5, 10] : [1, 2, 5, 10]) if (m * p >= bruto) return m * p;
  return 10 * p;
}

function isoDia(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function renderPainel(
  payload: Contribuicoes,
  gstats: Estatisticas,
  logos: Logos,
  opts: { claro: boolean; estatico?: boolean; secoes?: Secoes; atualizadoEm?: string },
): string {
  const T = opts.claro ? TEMAS.claro : TEMAS.escuro;
  const STATIC = opts.estatico ?? false;
  const LIGHT = opts.claro;
  const SHOW = opts.secoes ?? TODAS_SECOES;
  const NEU_TXT = T.SEC;

  /** BoardUI Chip (variant=bold) + DeltaPill. Retorna [svg, largura]. */
  function chip(x: number, y: number, text: string, kind: string): [string, number] {
    const FS = 14;
    const H = 24; // 20px line + 2px top/bottom
    const tw = medir(text);
    const base = STATIC ? "" : ' class="meta"';
    let bg: string, fg: string, w: number, icon: string, tx: number;
    if (kind === "lime") {
      [bg, fg] = [T.LIME_BG, T.LIME_TXT];
      w = 4 + 16 + 4 + tw + 8;
      const [cx, cy] = [x + 4 + 8, y + H / 2];
      icon = `<circle cx="${f0(cx)}" cy="${f0(cy)}" r="8" fill="${fg}"/>`
        + `<rect x="${(cx - 1.9).toFixed(1)}" y="${(cy - 1.5).toFixed(1)}" width="3.8" height="5.5" rx="1" fill="${T.CARD}"/>`
        + `<polygon points="${(cx - 5).toFixed(1)},${(cy - 0.5).toFixed(1)} ${cx.toFixed(1)},${(cy - 6).toFixed(1)} ${(cx + 5).toFixed(1)},${(cy - 0.5).toFixed(1)}" fill="${T.CARD}"/>`;
      tx = x + 24;
    } else if (kind === "rose") {
      [bg, fg] = [T.ROSE_BG, T.ROSE_TXT];
      w = 4 + 16 + 4 + tw + 8;
      const [cx, cy] = [x + 4 + 8, y + H / 2];
      icon = `<circle cx="${f0(cx)}" cy="${f0(cy)}" r="8" fill="${fg}"/>`
        + `<rect x="${(cx - 1.9).toFixed(1)}" y="${(cy - 4).toFixed(1)}" width="3.8" height="5.5" rx="1" fill="${T.CARD}"/>`
        + `<polygon points="${(cx - 5).toFixed(1)},${(cy + 0.5).toFixed(1)} ${cx.toFixed(1)},${(cy + 6).toFixed(1)} ${(cx + 5).toFixed(1)},${(cy + 0.5).toFixed(1)}" fill="${T.CARD}"/>`;
      tx = x + 24;
    } else {
      [bg, fg] = [T.NEU_BG, NEU_TXT];
      w = 6 + tw + 6;
      icon = "";
      tx = x + 6;
    }
    const rx = kind === "lime" || kind === "rose" ? 12 : 6;
    const op = kind === "neutral" || LIGHT ? "" : ' fill-opacity="0.6"';
    return [`<g${base}><rect x="${f0(x)}" y="${f0(y)}" width="${f0(w)}" height="${H}" rx="${rx}" fill="${bg}"${op}/>${icon}`
      + `<text x="${f0(tx)}" y="${f0(y + 17)}" fill="${fg}" font-size="${FS}" font-weight="500">${esc(text)}</text></g>`, w];
  }

  const svgUser = payload.username || "GitHub";
  const days = payload.days;
  const stats = payload.stats;
  const byDate = new Map(days.map((d) => [d.date, d]));

  const monthly = stats.monthly_totals ?? {};
  const pad = (m: number) => String(m).padStart(2, "0");
  // "hoje" = último dia do calendário (os dados vão até a data da coleta)
  const hoje = days.length ? days[days.length - 1].date : new Date().toISOString().slice(0, 10);
  const Y = Number(hoje.slice(0, 4));
  const mesHoje = Number(hoje.slice(5, 7));
  const diaHoje = Number(hoje.slice(8, 10));
  const keys = Array.from({ length: 12 }, (_, i) => `${Y}-${pad(i + 1)}`);
  const mvals = keys.map((k) => monthly[k] ?? 0);
  const ytd = mvals.reduce((a, b) => a + b, 0);
  const curVal = monthly[`${Y}-${pad(mesHoje)}`] ?? 0;

  // comparações justas: sempre contra o MESMO período (o mês e o ano ainda
  // não acabaram, então comparar com o mês/ano inteiro anterior assusta)
  const [yAnt, mAnt] = mesHoje === 1 ? [Y - 1, 12] : [Y, mesHoje - 1];
  let mesAntMesmosDias = 0;
  let anoAntMesmoPeriodo = 0;
  const limiteAnoAnt = `${Y - 1}${hoje.slice(4)}`;
  for (const d of days) {
    if (d.date.startsWith(`${yAnt}-${pad(mAnt)}-`) && Number(d.date.slice(8, 10)) <= diaHoje) {
      mesAntMesmosDias += d.count;
    }
    if (d.date.startsWith(`${Y - 1}-`) && d.date <= limiteAnoAnt) anoAntMesmoPeriodo += d.count;
  }
  const [tYoy, kYoy] = deltaChip(ytd, anoAntMesmoPeriodo) ?? [String(Y), "neutral"];
  const [tMonth, kMonth] = deltaChip(curVal, mesAntMesmosDias) ?? ["—", "neutral"];
  const capAno = `${fmt(anoAntMesmoPeriodo)} até ${pad(diaHoje)}/${pad(mesHoje)}/${String(Y - 1).slice(2)}`;
  const capMes = `${fmt(mesAntMesmosDias)} em ${diaHoje === 1 ? "1" : `1 a ${diaHoje}`} ${MESES[mAnt].toLowerCase()}`;

  const streak = stats.current_streak ?? 0;
  const longest = stats.longest_streak ?? 0;
  const bestN = stats.best_day_count ?? 0;
  const bestD = stats.best_day || "";
  let bestLbl = bestD;
  if (/^\d{4}-\d{2}-\d{2}$/.test(bestD)) {
    bestLbl = `${Number(bestD.slice(8, 10))} ${MESES[Number(bestD.slice(5, 7))].toLowerCase()}`;
  }

  // heatmap weeks
  let weeks: (Dia | undefined)[][] = [];
  if (days.length) {
    const start = new Date(`${days[0].date}T00:00:00Z`);
    const end = new Date(`${days[days.length - 1].date}T00:00:00Z`);
    const cur = new Date(start.getTime() - start.getUTCDay() * 86400000);
    while (cur <= end) {
      const week: (Dia | undefined)[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(byDate.get(isoDia(cur)));
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      weeks.push(week);
    }
    weeks = weeks.slice(-53);
  }

  const langs = (gstats.languages ?? []).slice(0, 8);
  const repoCount = gstats.repo_count ?? 0;

  const H_STATS = 172, H_STATS2 = 124, GAP = 16;
  const H_CHART = 300, H_HEAT = 196;
  const H_LANG = langs.length ? 76 + (langs.length - 1) * 30 : 120;
  let y = GAP;
  let yTopo = 0, yKpi = 0, yKpi2 = 0, yChart = 0, yLang = 0, yHeat = 0;
  // topo: nome à esquerda, hora da atualização à direita
  const H_TOPO = 28;
  const temTopo = SHOW.header && !!opts.atualizadoEm;
  if (temTopo) {
    yTopo = y;
    y += H_TOPO + GAP;
  }
  if (SHOW.kpis) {
    yKpi = y;
    y += H_STATS + GAP;
  }
  if (SHOW.extras) {
    yKpi2 = y;
    y += H_STATS2 + GAP;
  }
  if (SHOW.chart) {
    yChart = y;
    y += H_CHART + GAP;
  }
  if (SHOW.languages) {
    yLang = y;
    y += H_LANG + GAP;
  }
  if (SHOW.heatmap) {
    yHeat = y;
    y += H_HEAT + GAP;
  }
  const H = y + 2;

  const p: string[] = [];
  p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" `
    + `viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img">`);
  p.push(`<title>Dashboard GitHub de ${esc(svgUser)}</title>`
    + "<desc>Contribuições, linguagens, streak e estatísticas atualizados automaticamente.</desc>");
  p.push("<defs>" + Object.entries(TONES).map(([t, [a, b]]) =>
    `<linearGradient id="t${t}" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join("") + "</defs>");
  if (STATIC) {
    p.push("<style>.cell,.row,.meta{opacity:1;}</style>");
  } else {
    p.push(`<style>
.cell{opacity:0;animation:drop .45s ease-out forwards;}
@keyframes drop{from{opacity:0;transform:translateY(-7px);}to{opacity:1;transform:translateY(0);}}
.row{opacity:0;animation:rowin .5s ease-out forwards;}
@keyframes rowin{from{opacity:0;transform:translateX(10px);}to{opacity:1;transform:translateX(0);}}
.meta{opacity:0;animation:fadein .8s ease-out forwards;}
@keyframes fadein{to{opacity:1;}}
@media (prefers-reduced-motion:reduce){.cell,.row,.meta{animation:none;opacity:1;}}
</style>`);
  }

  const card = (x: number, yy: number, w: number, h: number) => {
    p.push(`<rect x="${f0(x)}" y="${f0(yy)}" width="${f0(w)}" height="${f0(h)}" rx="16" fill="${T.CARD}" stroke="${T.CARD_BORDER}"/>`);
  };

  const px = 20;

  // ---- topo: "GitHub Dashboard" + "atualizado em 08/10, 19:30 (Brasília)" ----
  if (temTopo && opts.atualizadoEm) {
    const quando = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(opts.atualizadoEm));
    const textoHora = `atualizado em ${quando} (Brasília)`;
    const cy = yTopo + H_TOPO / 2;
    // a métrica é da DejaVu (mais larga que a Inter): 0.88 aproxima
    const largHora = (((medir(textoHora) - 2) * 12) / 14) * 0.88;
    const mt = STATIC ? "" : ' class="meta" style="animation-delay:0.05s"';
    p.push(`<g${mt}>`
      + `<rect x="2" y="${f0(cy - 12)}" width="24" height="24" rx="7" fill="url(#temerald)"/>`
      + `<circle cx="14" cy="${f0(cy)}" r="4.5" fill="#FFFFFF"/>`
      + `<text x="36" y="${f0(cy + 5)}" fill="${T.FG}" font-size="15" font-weight="600">GitHub Dashboard</text>`
      + `<circle cx="${f0(W - 4 - largHora - 8)}" cy="${f0(cy)}" r="3.5" fill="${ACCENT}"/>`
      + `<text x="${W - 4}" y="${f0(cy + 4)}" fill="${T.TER}" font-size="12" text-anchor="end">${esc(textoHora)}</text>`
      + "</g>");
  }

  // ---- row 1: plain stat cards ----
  const cw = (W - 3 * GAP) / 4;
  // [glifo, tom, rótulo, valor, pílula, tipo, legenda, atraso, unidade?]
  type Card = [string, string, string, string, string, string, string, number, string?];
  const cards: Card[] = [
    ["●", "emerald", "Contribuições", fmt(ytd), tYoy, kYoy, capAno, 0.05],
    ["◆", "orange", "Este mês", fmt(curVal), tMonth, kMonth, capMes, 0.12],
    ["★", "purple", "Melhor dia", fmt(bestN), bestLbl, "neutral", "Recorde pessoal", 0.19],
    ["▲", "blue", "Streak atual", `${streak}`, `${longest} dias`, "neutral", "Recorde", 0.26, "dias"],
  ];

  // cabeçalho comum dos cartões: ícone, rótulo e o número grande (+ unidade)
  const topoCartao = (x: number, y0: number, glyph: string, tone: string, label: string,
    value: string, dl: number, unidade?: string, extra = "") => {
    const anim = STATIC ? "" : ` class="row" style="animation-delay:${dl.toFixed(2)}s"`;
    const [tcx, tcy] = [x + 32, y0 + 30];
    // largura do número a 40px, estimada pela métrica de 14px
    const vw = ((medir(value) - 2) * 40) / 14;
    const un = unidade
      ? `<text x="${f0(x + 16 + vw + 6)}" y="${f0(y0 + 106)}" fill="${T.SEC}" font-size="14">${esc(unidade)}</text>`
      : "";
    p.push(`<g${anim}><rect x="${f0(x + 16)}" y="${f0(y0 + 14)}" width="32" height="32" rx="8" fill="url(#t${tone})"/>`
      + `<g transform="translate(${f0(tcx)},${f0(tcy)})">${GLYPHS[glyph]}</g>`
      + `<text x="${f0(x + 16)}" y="${f0(y0 + 66)}" fill="${T.SEC}" font-size="12">${esc(label)}</text>`
      + `<text x="${f0(x + 16)}" y="${f0(y0 + 106)}" fill="${T.FG}" font-size="40" font-weight="600">${esc(value)}</text>${un}${extra}</g>`);
  };

  const statCard = (x: number, y0: number, w: number, [glyph, tone, label, value, delta, kind, caption, dl, unidade]: Card) => {
    card(x, y0, w, H_STATS);
    topoCartao(x, y0, glyph, tone, label, value, dl, unidade);
    // footer band: comparison caption (left) + delta pill (right)
    const by = y0 + H_STATS - 52;
    p.push(`<rect x="${f0(x + 8)}" y="${f0(by)}" width="${f0(w - 16)}" height="40" rx="10" fill="${T.BAND}"/>`);
    const [, chw] = chip(0, 0, delta, kind);
    const pillX = x + w - 14 - chw;
    let [ch] = chip(pillX, by + 8, delta, kind);
    if (!STATIC) {
      ch = ch.replace(' class="meta"', ` class="meta" style="animation-delay:${(dl + 0.15).toFixed(2)}s"`);
    }
    p.push(ch);
    const capW = (pillX - 6) - (x + 18);
    const cap = caption.length * 5.6 <= capW
      ? caption
      : caption.slice(0, Math.max(0, Math.trunc(capW / 5.6) - 1)) + "…";
    p.push(`<text x="${f0(x + 18)}" y="${f0(by + 26)}" fill="${T.TER}" font-size="11">${esc(cap)}</text>`);
  };

  if (SHOW.kpis) {
    cards.forEach((c, i) => statCard(i * (cw + GAP), yKpi, cw, c));
  }

  // ---- row 1b: PRs + Stars (cartões compactos, sem pílula) ----
  const cw2 = (W - GAP) / 2;
  const prsV = gstats.prs;
  const starsV = gstats.stars;
  const cards2: [string, string, string, string, string, number][] = [
    ["PR", "sky", "Pull requests", prsV !== null && prsV !== undefined ? fmt(prsV) : "—",
      "criados por você", 0.33],
    ["★", "yellow", "Stars", starsV !== null && starsV !== undefined ? fmt(starsV) : "—",
      "nos seus repositórios", 0.40],
  ];
  if (SHOW.extras) {
    cards2.forEach(([glyph, tone, label, value, caption, dl], i) => {
      const x = i * (cw2 + GAP);
      card(x, yKpi2, cw2, H_STATS2);
      topoCartao(x, yKpi2, glyph, tone, label, value, dl, undefined,
        `<text x="${f0(x + cw2 - 20)}" y="${f0(yKpi2 + 104)}" fill="${T.TER}" font-size="12" text-anchor="end">${esc(caption)}</text>`);
    });
  }

  // ---- row 2: chart card (só os meses; os totais já estão nos cartões) ----
  if (SHOW.chart) {
    card(0, yChart, W, H_CHART);
    p.push(`<text x="${px}" y="${f0(yChart + 30)}" fill="${T.SEC}" font-size="12">Contribuições por mês · ${Y}</text>`);
    const media = Math.round(ytd / Math.max(mesHoje, 1));
    p.push(`<text x="${f0(W - 20)}" y="${f0(yChart + 30)}" fill="${T.TER}" font-size="12" text-anchor="end">média de ${fmt(media)} por mês</text>`);
    const [bx0, bx1] = [64, W - 20];
    const [by0, by1] = [yChart + 62, yChart + H_CHART - 38];
    const maxV = Math.max(0, ...mvals);
    // eixo com números redondos (0 / 250 / 500...) e grade discreta
    const passo = passoRedondo(Math.max(maxV, 5) / 5);
    const topo = Math.max(passo, Math.ceil(maxV / passo) * passo);
    for (let v = 0; v <= topo; v += passo) {
      const yy = by1 - (v / topo) * (by1 - by0);
      p.push(`<line x1="${bx0}" y1="${f0(yy)}" x2="${bx1}" y2="${f0(yy)}" stroke="${T.TRACK}" stroke-width="1"/>`
        + `<text x="${bx0 - 10}" y="${f0(yy + 4)}" fill="${T.TER}" font-size="11" text-anchor="end">${fmt(v)}</text>`);
    }
    const slot = (bx1 - bx0) / keys.length;
    const bw = Math.min(24, slot - 8);
    const iPico = mvals.indexOf(maxV);
    keys.forEach((k, i) => {
      const v = mvals[i];
      const cx = bx0 + i * slot + slot / 2;
      // meses que ainda não chegaram ficam apagados
      const futuro = i + 1 > mesHoje ? ' fill-opacity="0.4"' : "";
      p.push(`<text x="${f0(cx)}" y="${f0(yChart + H_CHART - 14)}" fill="${T.TER}"${futuro} font-size="12" text-anchor="middle">${MESES[i + 1]}</text>`);
      if (v <= 0) return; // mês vazio: sem barra de mentira
      const hgt = Math.max(2, (v / topo) * (by1 - by0));
      const [x0, topY] = [cx - bw / 2, by1 - hgt];
      const r = Math.min(4, hgt, bw / 2);
      // ponta arredondada em cima, base reta no eixo
      const d = `M${x0.toFixed(1)},${by1}V${(topY + r).toFixed(1)}`
        + `A${r},${r} 0 0 1 ${(x0 + r).toFixed(1)},${topY.toFixed(1)}`
        + `H${(x0 + bw - r).toFixed(1)}A${r},${r} 0 0 1 ${(x0 + bw).toFixed(1)},${(topY + r).toFixed(1)}`
        + `V${by1}Z`;
      const at = STATIC ? "" : ` class="cell" style="animation-delay:${(0.5 + i * 0.06).toFixed(2)}s"`;
      p.push(`<path${at} d="${d}" fill="${ACCENT}"><title>${MESES[i + 1]} ${Y}: ${fmt(v)} contribuições</title></path>`);
      // valor só no pico e no mês atual (o resto fica no eixo)
      if (i === iPico || i + 1 === mesHoje) {
        const mt = STATIC ? "" : ` class="meta" style="animation-delay:${(0.9 + i * 0.06).toFixed(2)}s"`;
        p.push(`<text${mt} x="${f0(cx)}" y="${f0(topY - 8)}" fill="${T.SEC}" font-size="11" font-weight="500" text-anchor="middle">${fmt(v)}</text>`);
      }
    });
  }

  // ---- languages card (bar list) ----
  if (SHOW.languages) {
    card(0, yLang, W, H_LANG);
    p.push(`<text x="${px}" y="${f0(yLang + 26)}" fill="${T.SEC}" font-size="12">Linguagens mais usadas</text>`);
    p.push(`<text x="${f0(W - 20)}" y="${f0(yLang + 26)}" fill="${T.TER}" font-size="11" text-anchor="end">${repoCount} repositórios</text>`);
    if (langs.length) {
      const [tx0, tx1] = [210, W - 84];
      langs.forEach((lang, i) => {
        const ry = yLang + 52 + i * 30;
        const color = LANG_COLORS[lang.name] ?? LANG_DEFAULT;
        const pct = lang.pct;
        const dl = 0.7 + i * 0.08;
        const at = STATIC ? "" : ` class="cell" style="animation-delay:${dl.toFixed(2)}s"`;
        const logo = logos[lang.name];
        const mark = logo
          ? `<g transform="translate(23,${f0(ry - 3)}) scale(0.5833)">`
            + `<path d="${logo.path}" fill="${logo.color ?? color}"/></g>`
          : `<circle cx="30" cy="${f0(ry + 4)}" r="4" fill="${color}"/>`;
        p.push(`${mark}`
          + `<text x="44" y="${f0(ry + 8)}" fill="${T.FG}" font-size="12">${esc(Array.from(lang.name).slice(0, 18).join(""))}</text>`
          + `<rect x="${tx0}" y="${f0(ry)}" width="${f0(tx1 - tx0)}" height="8" rx="4" fill="${T.TRACK}"/>`
          + `<rect${at} x="${tx0}" y="${f0(ry)}" width="${f0(Math.max(4, (pct / 100) * (tx1 - tx0)))}" height="8" rx="4" fill="${color}">`
          + `<title>${esc(lang.name)}: ${f0(lang.bytes / 1024)} KB</title></rect>`
          + `<text x="${f0(W - 20)}" y="${f0(ry + 8)}" fill="${T.SEC}" font-size="12" text-anchor="end">${pyFloat(pct).replace(".", ",")}%</text>`);
      });
    } else {
      p.push(`<text x="${px}" y="${f0(yLang + 64)}" fill="${T.TER}" font-size="12">nenhum repositório público com código</text>`);
    }
  }

  // ---- row 3: heatmap card ----
  if (SHOW.heatmap) {
    card(0, yHeat, W, H_HEAT);
    p.push(`<text x="${px}" y="${f0(yHeat + 26)}" fill="${T.SEC}" font-size="12">Calendário</text>`);
    const [CELL, STEP, LEFT, TOP] = [12, 15, 64, yHeat + 52];
    let lastM: number | null = null;
    let lastX = -100.0;
    weeks.forEach((week, wi) => {
      for (const dd of week) {
        if (dd) {
          const m = Number(dd.date.slice(5, 7));
          const x = LEFT + wi * STEP;
          if (m !== lastM && x - lastX >= 30) {
            p.push(`<text x="${f0(x)}" y="${f0(TOP - 8)}" fill="${T.TER}" font-size="9">${MESES[m]}</text>`);
            lastX = x;
          }
          lastM = m;
          break;
        }
      }
    });
    for (const [di, nm] of [[0, "Dom"], [2, "Ter"], [4, "Qui"], [6, "Sáb"]] as const) {
      p.push(`<text x="30" y="${f0(TOP + di * STEP + 10)}" fill="${T.TER}" font-size="9">${nm}</text>`);
    }
    const paleta = [...T.HEAT, T.HEAT_TOP];
    weeks.forEach((week, wi) => {
      // one animation group per week (53) instead of per cell (~370):
      // same staggered reveal, far fewer bytes -> faster first paint
      const at = STATIC ? "" : ` class="cell" style="animation-delay:${(wi * 0.035).toFixed(2)}s"`;
      p.push(`<g${at}>`);
      week.forEach((dd, di) => {
        const x = LEFT + wi * STEP;
        const yy = TOP + di * STEP;
        if (!dd) return;
        const [lv, ct] = [dd.level, dd.count];
        const color = paleta[lv >= 4 && ct >= 30 ? 5 : Math.max(0, Math.min(lv, 4))];
        const dataBr = `${dd.date.slice(8, 10)}/${dd.date.slice(5, 7)}/${dd.date.slice(0, 4)}`;
        p.push(`<rect x="${f0(x)}" y="${f0(yy)}" width="${CELL}" height="${CELL}" rx="2.5" fill="${color}"><title>${ct} em ${dataBr}</title></rect>`);
      });
      p.push("</g>");
    });
    // rodapé com o total dos 12 meses (streak e melhor dia já estão nos cartões)
    const foot = `${fmt(payload.total_last_year ?? 0)} contribuições nos últimos 12 meses`;
    const fat = STATIC ? "" : ' class="meta" style="animation-delay:1.8s"';
    p.push(`<text${fat} x="${px}" y="${f0(yHeat + H_HEAT - 12)}" fill="${T.TER}" font-size="11">${esc(foot)}</text>`);
    // legenda Menos -> Mais, com todos os tons usados (sem repetir cor)
    const tons = [...new Set(paleta)];
    const llx = W - 128 - tons.length * 13;
    p.push(`<text x="${f0(llx - 8)}" y="${f0(yHeat + H_HEAT - 12)}" fill="${T.TER}" font-size="10" text-anchor="end">Menos</text>`);
    tons.forEach((c, i) => {
      p.push(`<rect x="${f0(llx + i * 13)}" y="${f0(yHeat + H_HEAT - 22)}" width="10" height="10" rx="2" fill="${c}"/>`);
    });
    p.push(`<text x="${f0(llx + tons.length * 13 + 4)}" y="${f0(yHeat + H_HEAT - 12)}" fill="${T.TER}" font-size="10">Mais</text>`);
  }

  p.push("</svg>");
  return p.join("\n") + "\n";
}
