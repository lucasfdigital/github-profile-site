# github-profile-site

Site do [github-profile-dashboard](https://github.com/lucasfdigital/github-profile-dashboard): landing + OAuth do GitHub → coloca o painel no README do repo `user/user`.

## Como o painel se atualiza

O README do usuário tem uma imagem que aponta para este site:

```
/api/painel/USUARIO              tema escuro
/api/painel/USUARIO?tema=claro   tema claro
/api/painel/USUARIO?excluir=repo1,repo2   tira repos das linguagens
/api/painel/USUARIO?ocultar=topo,cartoes,extras,grafico,linguagens,calendario   esconde partes
```

A página `/USUARIO` mostra o painel grande, com tema escuro/claro e link para compartilhar. Na tela de criar (`/gerar`), a pessoa escolhe as partes e os repos a esconder, com prévia ao vivo.

Quando alguém abre o perfil, o GitHub pede a imagem; a rota busca os dados públicos do usuário (uma consulta GraphQL) e monta o SVG. A CDN guarda cada imagem por 4h, então os dados se renovam sozinhos sem nada rodar na conta do usuário. O desenho é um port fiel de `scripts/render_profile_top.py` do template (`lib/painel/render.ts`).

Para parar, o usuário apaga do README o bloco entre `github-profile-dash:inicio` e `github-profile-dash:fim`.

## Rodar local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Registrar o OAuth App (2 min)

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App
2. **Application name**: `Profile Dashboard Setup`
3. **Homepage URL**: sua URL (local: `http://localhost:3000`)
4. **Authorization callback URL**: `https://sua-url/api/auth/callback` (local: `http://localhost:3000/api/auth/callback`)
5. Gere um **Client secret** e preencha `.env.local`

Scope pedido ao usuário: `public_repo` (criar o repo de perfil e editar o README). O token vive 30 min em cookie httpOnly e é apagado ao concluir — nada é guardado.

## Deploy na Vercel

```bash
npx vercel
```

Envs do projeto:

| Env | Pra quê |
|---|---|
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | OAuth App |
| `NEXT_PUBLIC_APP_URL` | URL final (callback do OAuth e links das imagens) |
| `GITHUB_TOKEN` | Token **seu** para as consultas do painel: token classic **sem nenhum scope marcado** (só lê dados públicos). Sem ele o painel mostra "Painel indisponível" |
| `BLOCKED_USERS` | Opcional: usernames separados por vírgula que não podem ter painel |

Atualize a callback URL no OAuth App pra URL final.
