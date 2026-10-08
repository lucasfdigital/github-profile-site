import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { appUrl } from "@/lib/github";

export async function GET(req: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("GITHUB_CLIENT_ID não configurado", { status: 500 });
  }
  const state = randomBytes(16).toString("hex");
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set(
    "redirect_uri",
    `${appUrl(req)}/api/auth/callback`,
  );
  // só repos públicos: criar/editar o README do repo de perfil
  url.searchParams.set("scope", "public_repo");
  url.searchParams.set("state", state);
  const res = NextResponse.redirect(url.toString());
  res.cookies.set("gh_state", state, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
    sameSite: "lax",
  });
  return res;
}
