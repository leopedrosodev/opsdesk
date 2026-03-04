# OpsDesk

Projeto de portfólio de Service Desk com backend em Spring Boot e frontend em Angular.

## Estrutura

```text
opsDesk/
  backend/   # API REST (Java 17, Spring Boot, JWT, JPA, Flyway)
  frontend/  # SPA (Angular 17, Router, Reactive Forms)
  infra/     # docker-compose e arquivos de infraestrutura local
  docs/      # documentação detalhada do estado atual
```

## Stack

- Backend: Java 17, Spring Boot, Spring Security JWT, PostgreSQL, Flyway
- Frontend: Angular 17, RxJS, Reactive Forms
- Infra: Docker, GitHub Actions

## Pré-requisitos

- Java 17+
- Node.js 20+
- Docker + Docker Compose

### Se você usa SDKMAN + NVM

```bash
cd backend && sdk env install && sdk env
cd ../frontend && nvm use
```

## Como rodar local

### 1) Subir banco e backend via Docker

```bash
cd infra
docker compose up --build
```

API disponível em `http://localhost:8080`.

Swagger: `http://localhost:8080/swagger-ui.html`

### 2) Rodar frontend

```bash
cd frontend
npm install
npm start
```

Frontend disponível em `http://localhost:4200`.

## Endpoints principais

- `POST /auth/register`
- `POST /auth/login`
- `GET|POST|PUT /tickets`
- `PATCH /tickets/{id}/status`
- `PATCH /tickets/{id}/assign/{assigneeId}`
- `POST /tickets/{id}/comments`
- `POST /tickets/{id}/assets/{assetId}`
- `GET|POST|PUT /assets`
- `GET|POST /runbooks`
- `GET /runbooks/{id}`

## Variáveis de ambiente backend

Veja `backend/.env.example`.

## Documentação completa

- `docs/README.md`
- `docs/GUIA-COMPLETO.md`

## CI/CD inicial

- `.github/workflows/backend-ci.yml`
- `.github/workflows/frontend-ci.yml`

## Próximos passos

1. Adicionar testes unitários por use case e controller.
2. Evoluir autorização por ownership de chamado.
3. Criar workflow de deploy automático para Render + Cloudflare Pages.
