// Opções do painel que viajam na URL da imagem (usadas pela rota, pelo
// setup e pelas telas do site). Sem dependências de servidor.
import type { Secoes } from "./render";

export const SECOES = [
  { id: "topo", chave: "header", nome: "Topo", desc: "nome e hora da atualização" },
  { id: "cartoes", chave: "kpis", nome: "Cartões", desc: "contribuições, mês, melhor dia e streak" },
  { id: "extras", chave: "extras", nome: "Pull requests e stars", desc: "" },
  { id: "grafico", chave: "chart", nome: "Gráfico por mês", desc: "" },
  { id: "linguagens", chave: "languages", nome: "Linguagens", desc: "" },
  { id: "calendario", chave: "heatmap", nome: "Calendário", desc: "últimos 12 meses" },
] as const;

export type IdSecao = (typeof SECOES)[number]["id"];

const IDS = new Set<string>(SECOES.map((s) => s.id));
// nome de repositório do GitHub (sem o dono)
const REPO = /^[\w.-]{1,100}$/;

export type Opcoes = { ocultar: string[]; excluir: string[] };

/** Limpa e valida o que veio da URL ou do formulário. */
export function normalizarOpcoes(ocultar: string[], excluir: string[]): Opcoes {
  return {
    ocultar: [...new Set(ocultar.map((s) => s.trim()).filter((s) => IDS.has(s)))].sort(),
    excluir: [...new Set(excluir.map((s) => s.trim()).filter((s) => REPO.test(s)))].slice(0, 20).sort(),
  };
}

/** true quando nenhuma parte com conteúdo sobrou (só o topo não basta). */
export const semConteudo = (ocultar: string[]) =>
  SECOES.every((s) => s.id === "topo" || ocultar.includes(s.id));

/** "a,b" -> ["a", "b"] */
export const lerLista = (v: string | null) => (v ?? "").split(",").filter(Boolean);

export function secoesVisiveis(ocultar: string[]): Secoes {
  const s = { header: true, kpis: true, extras: true, chart: true, languages: true, heatmap: true };
  for (const sec of SECOES) if (ocultar.includes(sec.id)) s[sec.chave] = false;
  return s;
}

/** Query string da imagem ("?tema=claro&ocultar=...&excluir=...") ou "". */
export function queryPainel(o: Opcoes & { claro?: boolean }): string {
  const partes: string[] = [];
  if (o.claro) partes.push("tema=claro");
  if (o.ocultar.length) partes.push(`ocultar=${o.ocultar.join(",")}`);
  if (o.excluir.length) partes.push(`excluir=${o.excluir.join(",")}`);
  return partes.length ? `?${partes.join("&")}` : "";
}
