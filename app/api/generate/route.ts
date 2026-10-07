import { NextResponse } from "next/server";
import { TEMPLATE_OWNER, TEMPLATE_REPO, appUrl, getToken, gh } from "@/lib/github";

async function getJson(res: Response) {
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  return res.json();
}

export async function POST(req: Request) {
  const base = appUrl(req);
  const token = getToken(req);
  if (!token) return NextResponse.redirect(`${base}/`, 303);

  const me = (await (
    await gh("/user", token)
  ).json()) as { login: string };
  const login = me.login;

  // 1. gera o repo user/user a partir do template
  const gen = await gh(
    `/repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ owner: login, name: login, private: false }),
    },
  );
  if (gen.status === 422) {
    return NextResponse.redirect(`${base}/gerar?erro=existe`, 303);
  }
  if (!gen.ok) {
    return NextResponse.redirect(`${base}/gerar?erro=github`, 303);
  }

  try {
    // 2. README do perfil: profile/README.md -> README.md da raiz.
    //    Esse commit também garante o trigger do workflow (evento push).
    const tpl = (await getJson(
      await gh(`/repos/${login}/${login}/contents/profile/README.md`, token),
    )) as { content: string; sha: string };
    const root = (await getJson(
      await gh(`/repos/${login}/${login}/contents/README.md`, token),
    )) as { sha: string };
    await getJson(
      await gh(`/repos/${login}/${login}/contents/README.md`, token, {
        method: "PUT",
        body: JSON.stringify({
          message: "setup: README do perfil com dashboard",
          content: tpl.content.replace(/\n/g, ""),
          sha: root.sha,
        }),
      }),
    );
    await gh(`/repos/${login}/${login}/contents/profile/README.md`, token, {
      method: "DELETE",
      body: JSON.stringify({
        message: "setup: limpa template",
        sha: tpl.sha,
      }),
    });
  } catch {
    // segue o jogo: o usuário completa manual (docs no template)
  }

  // 3. tenta disparar a primeira atualização (o push acima já dispara também)
  try {
    await gh(
      `/repos/${login}/${login}/actions/workflows/update-profile-art.yml/dispatches`,
      token,
      { method: "POST", body: JSON.stringify({ ref: "main" }) },
    );
  } catch {
    // push já dispara o workflow; segue o jogo
  }

  const res = NextResponse.redirect(
    `${base}/sucesso?repo=${encodeURIComponent(`${login}/${login}`)}`,
    303,
  );
  res.cookies.delete("gh_token");
  return res;
}
