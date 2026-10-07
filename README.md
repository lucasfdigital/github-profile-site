# github-profile-site

Site configurador do [github-profile-dashboard](../github-profile-dashboard): landing + OAuth do GitHub → cria o repo `user/user` a partir do template e dispara a primeira atualização.

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

Scopes pedidos ao usuário: `repo` (criar o repo) + `workflow` (disparar o workflow). O token vive 30 min em cookie httpOnly e é apagado ao concluir — nada é guardado.

## Deploy na Vercel

```bash
npx vercel
```

Adicione as 3 envs (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`) no projeto e atualize a callback URL no OAuth App pra URL final.
