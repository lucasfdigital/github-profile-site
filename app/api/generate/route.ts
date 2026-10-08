import { NextResponse } from "next/server";
import { appUrl, getToken, gh } from "@/lib/github";
import { blocoPainel, readmeComPainel } from "@/lib/painel/readme";
import { normalizarOpcoes, semConteudo } from "@/lib/painel/opcoes";

export const maxDuration = 60;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const base = appUrl(req);
  const token = getToken(req);
  if (!token) return NextResponse.redirect(`${base}/`, 303);
  const erro = (tipo: string) =>
    NextResponse.redirect(`${base}/gerar?erro=${tipo}`, 303);

  // escolhas da tela /gerar: partes escondidas e repos fora das linguagens
  const form = await req.formData().catch(() => null);
  const lista = (campo: string) =>
    (form?.getAll(campo) ?? []).filter((v): v is string => typeof v === "string");
  const opcoes = normalizarOpcoes(lista("ocultar"), lista("excluir"));
  if (semConteudo(opcoes.ocultar)) return erro("vazio");

  const meRes = await gh("/user", token);
  if (!meRes.ok) return NextResponse.redirect(`${base}/`, 303);
  const { login } = (await meRes.json()) as { login: string };
  const repo = `${login}/${login}`;

  // 1. repo de perfil user/user: cria se não existe. Se existe, o README
  //    dele é mantido e o painel entra no topo (fluxo repetível).
  const atualRes = await gh(`/repos/${repo}`, token);
  if (atualRes.status === 404) {
    const criado = await gh("/user/repos", token, {
      method: "POST",
      body: JSON.stringify({
        name: login,
        description: "Meu perfil do GitHub",
        private: false,
        auto_init: false,
      }),
    });
    if (!criado.ok) return erro("github");
  } else if (!atualRes.ok) {
    return erro("github");
  } else if (((await atualRes.json()) as { private: boolean }).private) {
    // README de perfil só aparece em repo público
    return erro("privado");
  }

  // 2. README com o bloco do painel (a imagem vem deste site e se
  //    atualiza sozinha; nada roda na conta do usuário)
  let path = "README.md";
  let sha: string | undefined;
  let atual: string | null = null;
  const readmeRes = await gh(`/repos/${repo}/readme`, token);
  if (readmeRes.ok) {
    const r = (await readmeRes.json()) as { path: string; sha: string; content: string };
    path = r.path;
    sha = r.sha;
    atual = Buffer.from(r.content, "base64").toString("utf8");
  } else if (readmeRes.status !== 404) {
    return erro("setup");
  }

  const novo = readmeComPainel(atual, blocoPainel(base, login, opcoes));
  if (novo !== atual) {
    // repo recém-criado pode levar alguns segundos para aceitar commits
    let salvo = false;
    for (let i = 0; i < 4 && !salvo; i++) {
      if (i) await sleep(2000);
      const put = await gh(`/repos/${repo}/contents/${path}`, token, {
        method: "PUT",
        body: JSON.stringify({
          message: "feat: dashboard do perfil",
          content: Buffer.from(novo, "utf8").toString("base64"),
          ...(sha ? { sha } : {}),
        }),
      });
      salvo = put.ok;
      // 409/422 = conflito ou repo ainda nascendo: tenta de novo
      if (!put.ok && put.status !== 409 && put.status !== 422 && put.status !== 404) break;
    }
    if (!salvo) return erro("setup");
  }

  const res = NextResponse.redirect(
    `${base}/sucesso?user=${encodeURIComponent(login)}`,
    303,
  );
  res.cookies.delete("gh_token");
  return res;
}
