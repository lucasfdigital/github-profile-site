import type { NextRequest } from "next/server";
import { buscarDadosPainel } from "@/lib/painel/dados";
import { renderPainel, type Logos } from "@/lib/painel/render";
import { lerLista, normalizarOpcoes, secoesVisiveis, semConteudo } from "@/lib/painel/opcoes";
import logos from "@/lib/painel/lang_logos.json";

// O README do usuário aponta pra cá. O GitHub busca a imagem quando alguém
// abre o perfil; a CDN guarda por 4h, então os dados se renovam sozinhos
// sem robô, cron ou token do usuário.
const QUATRO_HORAS = 4 * 60 * 60;
const CINCO_MINUTOS = 5 * 60;

// regra de username do GitHub: letras, números e hífens no meio, até 39
const USUARIO = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(corpo: string, cacheSegundos: number): Response {
  return new Response(corpo, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": `public, max-age=${cacheSegundos}, s-maxage=${cacheSegundos}, stale-while-revalidate=86400`,
      // SVG aberto direto no navegador: nada de script
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}

/** Erros também viram imagem (status 200): o README mostra a mensagem em
 *  vez de um ícone quebrado. Cache curto para se recuperar logo. */
function svgErro(mensagem: string, claro: boolean): Response {
  const [fundo, borda, texto] = claro
    ? ["#FFFFFF", "#E4E4E7", "#52525B"]
    : ["#131318", "rgba(255,255,255,0.08)", "#A1A1AA"];
  return svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="96" viewBox="0 0 880 96" font-family="Inter,ui-sans-serif,system-ui,sans-serif" role="img">
<rect x="0.5" y="0.5" width="879" height="95" rx="16" fill="${fundo}" stroke="${borda}"/>
<text x="440" y="54" fill="${texto}" font-size="14" text-anchor="middle">${esc(mensagem)}</text>
</svg>
`,
    CINCO_MINUTOS,
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user: string }> },
) {
  const { user } = await params;
  const busca = req.nextUrl.searchParams;
  const claro = ["claro", "light"].includes(busca.get("tema") ?? "");

  if (!USUARIO.test(user)) return svgErro("Usuário inválido", claro);
  const bloqueados = (process.env.BLOCKED_USERS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (bloqueados.includes(user.toLowerCase())) {
    return svgErro("Painel indisponível", claro);
  }

  // ?excluir=repo1,repo2 tira repos das linguagens (docs, playground...)
  // ?ocultar=grafico,calendario esconde partes do painel
  const { ocultar, excluir } = normalizarOpcoes(
    lerLista(busca.get("ocultar")),
    lerLista(busca.get("excluir")),
  );
  if (semConteudo(ocultar)) {
    return svgErro("Escolha pelo menos uma parte do painel", claro);
  }
  const hoje = new Date().toISOString().slice(0, 10);

  try {
    const dados = await buscarDadosPainel(user, excluir, hoje);
    if (!dados) return svgErro(`Usuário ${user} não encontrado no GitHub`, claro);
    return svg(
      renderPainel(dados.contrib, dados.stats, logos as Logos, {
        claro,
        secoes: secoesVisiveis(ocultar),
        atualizadoEm: dados.atualizadoEm,
      }),
      QUATRO_HORAS,
    );
  } catch (e) {
    console.error(`painel ${user}:`, e);
    return svgErro("Painel indisponível agora — volta em alguns minutos", claro);
  }
}
