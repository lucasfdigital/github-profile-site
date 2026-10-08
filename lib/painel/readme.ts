import { queryPainel, type Opcoes } from "./opcoes";

// Bloco do painel no README do perfil. Os marcadores deixam o setup
// repetível: rodar de novo troca o bloco em vez de duplicar, e o usuário
// sabe exatamente o que apagar para parar de usar.
const INICIO = "<!-- github-profile-dash:inicio -->";
const FIM = "<!-- github-profile-dash:fim -->";

// bloco da versão antiga (template + robô): <picture> com os SVGs do repo
const BLOCO_ANTIGO =
  /<div align="center">\s*<picture>\s*<source[^>]*profile-top\.svg[^>]*>\s*<img[^>]*profile-top-light\.svg[^>]*>\s*<\/picture>\s*<\/div>/;

export function blocoPainel(
  base: string,
  login: string,
  opcoes: Opcoes = { ocultar: [], excluir: [] },
): string {
  const url = `${base}/api/painel/${login}`;
  // dentro de atributo HTML o & vira &amp;
  const q = (claro: boolean) => queryPainel({ ...opcoes, claro }).replace(/&/g, "&amp;");
  return `${INICIO}
<div align="center">

<picture>
<source media="(prefers-color-scheme: dark)" srcset="${url}${q(false)}">
<img src="${url}${q(true)}" width="860" alt="Dashboard GitHub de ${login}" />
</picture>

</div>
${FIM}`;
}

/** README novo: troca o bloco se já existe (nosso ou da versão antiga),
 *  senão coloca o painel no topo e mantém o resto como estava. */
export function readmeComPainel(atual: string | null, bloco: string): string {
  if (atual === null || atual.trim() === "") return `${bloco}\n`;
  const i = atual.indexOf(INICIO);
  const f = atual.indexOf(FIM);
  if (i !== -1 && f > i) return atual.slice(0, i) + bloco + atual.slice(f + FIM.length);
  if (BLOCO_ANTIGO.test(atual)) return atual.replace(BLOCO_ANTIGO, bloco);
  return `${bloco}\n\n${atual}`;
}
