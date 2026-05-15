# OpsDesk - Deploy de Produção (Cloudflare + Render + Neon)

Última atualização: 2026-05-15

## 1. Estado atual

- Frontend já publicado no Cloudflare Pages.
- Backend publicado no Render.
- Banco Neon conectado ao Render via variáveis de ambiente.

## 2. Banco (Neon)

1. Criar projeto e database no Neon.
2. Copiar credenciais:
   - host
   - database
   - username
   - password
3. Montar URL JDBC para Render:

```text
jdbc:postgresql://HOST/DB?sslmode=require
```

## 3. Backend (Render)

Você pode usar `infra/render.yaml` (Blueprint) ou configurar manualmente.

### 3.1 Manual (Dashboard)

1. New -> Web Service.
2. Repo: `opsdesk`.
3. Root Directory: `backend`.
4. Runtime: `Docker`.
5. Variáveis de ambiente:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET` com valor forte, sem usar o valor de exemplo
   - `JWT_EXPIRATION_MINUTES=120`
   - `CORS_ALLOWED_ORIGINS=https://opsdesk-6y3.pages.dev`
6. Deploy.

### 3.2 Validação após deploy

1. `GET https://SEU_BACKEND.onrender.com/health`
2. `GET https://SEU_BACKEND.onrender.com/swagger-ui.html`
3. Testar `POST /auth/register` e `POST /auth/login`.
4. Confirmar que o cadastro público retorna usuário com perfil `USER`.

## 4. Frontend (Cloudflare Pages)

Se o backend ganhar URL nova, atualizar:

- `frontend/src/environments/environment.prod.ts`

Valor esperado:

```ts
apiUrl: 'https://SEU_BACKEND.onrender.com'
```

Depois, fazer novo deploy no Pages.

Configuração recomendada do Pages:

- Framework preset: `Angular`
- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Build output directory: `dist/opsdesk/browser`
- Env var: `NODE_VERSION=20.19.0`

## 5. Checklist final de smoke test

- [ ] Abrir frontend em produção.
- [ ] Registrar usuário.
- [ ] Fazer login.
- [ ] Criar ticket.
- [ ] Criar asset.
- [ ] Criar runbook.

## 6. Segurança de cadastro

O endpoint público `POST /auth/register` não aceita escolha de perfil. Todo cadastro público nasce como `USER`; perfis `TECH` e `ADMIN` devem ser criados por fluxo administrativo ou seed controlado.
