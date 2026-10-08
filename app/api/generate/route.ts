import { NextResponse } from "next/server";
import { TEMPLATE_OWNER, TEMPLATE_REPO, appUrl, getToken, gh } from "@/lib/github";
import { PLACEHOLDER_DARK, PLACEHOLDER_LIGHT } from "@/lib/placeholders";

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
  const repo = `${login}/${login}`;

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
    // 2. commit único de setup via Git Data API:
    //    README do perfil na raiz + placeholders (nunca dados alheios)
    //    + remove profile/. O push deste commit dispara o workflow.
    const ref = (await getJson(
      await gh(`/repos/${repo}/git/ref/heads/main`, token),
    )) as { object: { sha: string } };
    const prRes = await gh(`/repos/${repo}/contents/profile/README.md`, token, {
      headers: { Accept: "application/vnd.github.raw" },
    });
    if (!prRes.ok) throw new Error(`profile README: ${prRes.status}`);
    const profileReadme = await prRes.text();

    const tree = (await getJson(
      await gh(`/repos/${repo}/git/trees`, token, {
        method: "POST",
        body: JSON.stringify({
          base_tree: ref.object.sha,
          tree: [
            {
              path: "README.md",
              mode: "100644",
              type: "blob",
              content: profileReadme,
            },
            {
              path: "profile-top.svg",
              mode: "100644",
              type: "blob",
              content: PLACEHOLDER_DARK,
            },
            {
              path: "profile-top-light.svg",
              mode: "100644",
              type: "blob",
              content: PLACEHOLDER_LIGHT,
            },
            {
              path: "profile/README.md",
              mode: "100644",
              type: "blob",
              sha: null,
            },
          ],
        }),
      }),
    )) as { sha: string };
    const commit = (await getJson(
      await gh(`/repos/${repo}/git/commits`, token, {
        method: "POST",
        body: JSON.stringify({
          message: "setup: dashboard do perfil",
          tree: tree.sha,
          parents: [ref.object.sha],
        }),
      }),
    )) as { sha: string };
    await getJson(
      await gh(`/repos/${repo}/git/ref/heads/main`, token, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha }),
      }),
    );
  } catch {
    return NextResponse.redirect(`${base}/gerar?erro=setup`, 303);
  }

  const res = NextResponse.redirect(
    `${base}/sucesso?repo=${encodeURIComponent(repo)}`,
    303,
  );
  res.cookies.delete("gh_token");
  return res;
}
