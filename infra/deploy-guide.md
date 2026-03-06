# OpsDesk - Deploy de Produção (Cloudflare + Render + Neon)

Última atualização: 2026-03-05

## 1. Estado atual

- Frontend já publicado no Cloudflare Pages.
- Backend pronto para deploy no Render.
- Banco Neon ainda precisa ser conectado ao Render.

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
   - `JWT_SECRET`
   - `JWT_EXPIRATION_MINUTES=120`
6. Deploy.

### 3.2 Validação após deploy

1. `GET https://SEU_BACKEND.onrender.com/health`
2. `GET https://SEU_BACKEND.onrender.com/swagger-ui.html`
3. Testar `POST /auth/register` e `POST /auth/login`.

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
