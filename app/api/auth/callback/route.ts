import { NextResponse } from "next/server";
import { appUrl } from "@/lib/github";

function getCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function GET(req: Request) {
  const base = appUrl(req);
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = getCookie(req, "gh_state");
  if (!code || !state || state !== expected) {
    return NextResponse.redirect(`${base}/?erro=oauth`);
  }
  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = (await r.json()) as {
    access_token?: string;
    error_description?: string;
  };
  if (!data.access_token) {
    return NextResponse.redirect(
      `${base}/?erro=${encodeURIComponent(data.error_description ?? "token")}`,
    );
  }
  const res = NextResponse.redirect(`${base}/gerar`);
  res.cookies.set("gh_token", data.access_token, {
    httpOnly: true,
    path: "/",
    maxAge: 1800, // só dura a sessão de setup
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookies.delete("gh_state");
  return res;
}
