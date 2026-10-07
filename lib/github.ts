export const TEMPLATE_OWNER =
  process.env.TEMPLATE_OWNER ?? "lucasfdigital";
export const TEMPLATE_REPO =
  process.env.TEMPLATE_REPO ?? "github-profile-dashboard";

export function getToken(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)gh_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function gh(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export function appUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env) return env.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
