import { NextResponse } from "next/server";
import { TEMPLATE_OWNER, TEMPLATE_REPO, appUrl, getToken, gh } from "@/lib/github";

export async function POST(req: Request) {
  const base = appUrl(req);
  const token = getToken(req);
  if (!token) return NextResponse.redirect(`${base}/`);

  const me = (await (await gh("/user", token)).json()) as { login: string };
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
    return NextResponse.redirect(`${base}/gerar?erro=existe`);
  }
  if (!gen.ok) {
    return NextResponse.redirect(`${base}/gerar?erro=github`);
  }

  // 2. dispara a primeira atualização (o push já dispara também; aqui é garantia)
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
  );
  res.cookies.delete("gh_token");
  return res;
}
