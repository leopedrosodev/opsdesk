# OpsDesk - Deploy (Render + Cloudflare + Neon)

## Backend (Render)

1. Criar Web Service apontando para pasta `backend`.
2. Build command: `mvn -B clean package`.
3. Start command: `java -jar target/opsdesk-backend-0.0.1-SNAPSHOT.jar`.
4. Configurar variáveis:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION_MINUTES`

## Frontend (Cloudflare Pages)

1. Criar projeto apontando para pasta `frontend`.
2. Build command: `npm install && npm run build`.
3. Build output: `dist/opsdesk`.
4. Definir variável de ambiente de build para API:
   - `NG_APP_API_URL` (opcional, se quiser externalizar)

## Banco (Neon)

1. Criar database PostgreSQL.
2. Copiar connection string.
3. Aplicar no Render com SSL habilitado se exigido pelo plano.

## Domínio

- Cloudflare Pages custom domain, ou `*.is-a.dev` apontando para Pages.
