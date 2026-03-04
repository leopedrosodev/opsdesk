# OpsDesk - Guia Completo (Estado Atual)

Este documento descreve como o projeto esta hoje, com foco didatico para aprendizado.

## 1. Visao Geral

OpsDesk é um Service Desk com:

- API REST em Java 17 + Spring Boot.
- Frontend SPA em Angular 17.
- Banco PostgreSQL com migracoes Flyway.
- Autenticacao JWT com papeis (`ADMIN`, `TECH`, `USER`).

Objetivo atual: ter um MVP funcional para portfólio, com boa organizacão de código e base pronta para evolucão.

## 2. Estrutura do Repositório


opsDesk/
  backend/   -> API Spring Boot
  frontend/  -> SPA Angular
  infra/     -> docker-compose e guias de deploy


Arquivos principais:

- `README.md`
- `backend/pom.xml`
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/db/migration/V1__init.sql`
- `frontend/package.json`
- `infra/docker-compose.yml`

## 3. Backend (Java + Spring)

## 3.1 Arquitetura em camadas

O backend segue uma separacão inspirada em Clean Architecture:

- `domain`
  - Entidades de negócio (`User`, `Ticket`, `Asset`, `Runbook`, etc).
  - Contratos de repositório (ports), sem dependência de Spring Data.
- `application`
  - Casos de uso (`AuthUseCase`, `TicketUseCase`, `AssetUseCase`, `RunbookUseCase`).
  - Regras de negocio e validacoes.
- `infrastructure`
  - Persistencia JPA (entidades de banco, repositorios Spring Data, adapters).
  - Seguranca (JWT, filtro, config do Spring Security).
- `api`
  - Controllers REST.
  - DTOs de entrada/saida.
  - Mappers entre dominio e resposta HTTP.

Essa separacão facilita manutencão e testes: a regra de negócio não depende diretamente de detalhes de banco/framework.

## 3.2 Fluxo de uma requisicão (exemplo)

Exemplo: `POST /tickets`

1. `TicketController` recebe JSON e valida DTO (`TicketRequest`).
2. Controller resolve usuário autenticado (`CurrentUserResolver`).
3. Controller chama `TicketUseCase.create(...)`.
4. Use case cria `Ticket` de dominio com regras padrão (`status=OPEN`).
5. Use case usa `TicketRepositoryPort`.
6. `TicketRepositoryAdapter` converte dominio <-> JPA e usa `SpringDataTicketRepository`.
7. Resultado volta para controller.
8. Controller converte para `TicketResponse` e responde HTTP.

## 3.3 Entidades de dominio

### User

- `id`
- `fullName`
- `email`
- `passwordHash`
- `role` (`ADMIN`, `TECH`, `USER`)
- `createdAt`

### Ticket

- `id`
- `title`
- `description`
- `priority` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
- `creatorId`
- `assigneeId`
- `createdAt`
- `closedAt`

Regras no modelo/use case:

- Ao mover para `RESOLVED` ou `CLOSED`, `closedAt` e preenchido.
- Se status voltar para outro estado, `closedAt` vira `null`.
- Não permite `IN_PROGRESS` sem técnico atribuído.

### TicketComment

- `id`, `ticketId`, `authorId`, `content`, `createdAt`

### Asset

- `id`, `name`, `type`, `ownerId`, `ip`, `location`, `tags`

### Runbook

- `id`, `title`, `description`, `steps`, `authorId`, `createdAt`

## 3.4 Seguranca (JWT + RBAC)

Implementacão principal:

- `SecurityConfig` define rotas públicas e protegidas.
- `JwtAuthenticationFilter` intercepta o token `Bearer`.
- `JwtService` gera/valida JWT.
- `UserDetailsServiceAdapter` busca usuário por email.
- `SecurityUserPrincipal` representa usuário autenticado no Spring Security.

Configurações importantes:

- Rotas publicas: `/auth/**`, `/swagger-ui/**`, `/api-docs/**`, `/health`.
- Demais rotas exigem autenticação.
- Autorização por role via `@PreAuthorize` nos controllers.
- Senha com `BCrypt`.

### Claims do token

No token JWT são gravados:

- `sub` = email
- `uid` = id do usuário
- `role` = role do usuário

## 3.5 Banco de dados e migrações

Migração inicial em `V1__init.sql` cria:

- `users`
- `tickets`
- `ticket_comments`
- `assets`
- `asset_tags`
- `ticket_assets`
- `runbooks`

Tambem cria constraints e indices para status/prioridade/assignee/comentarios.

## 3.6 Endpoints implementados

## Auth

- `POST /auth/register`
- `POST /auth/login`

### Register request

```json
{
  "fullName": "Leonardo",
  "email": "leo@opsdesk.dev",
  "password": "12345678",
  "role": "USER"
}
```

### Login request

```json
{
  "email": "leo@opsdesk.dev",
  "password": "12345678"
}
```

### Auth response

```json
{
  "token": "<jwt>",
  "userId": 1,
  "fullName": "Leonardo",
  "email": "leo@opsdesk.dev",
  "role": "USER"
}
```

## Tickets

- `GET /tickets`
- `POST /tickets`
- `PUT /tickets/{id}`
- `PATCH /tickets/{id}/status`
- `PATCH /tickets/{id}/assign/{assigneeId}`
- `POST /tickets/{id}/comments`
- `GET /tickets/{id}/comments`
- `POST /tickets/{id}/assets/{assetId}`

### Create ticket

```json
{
  "title": "Notebook sem rede",
  "description": "Nao conecta no Wi-Fi corporativo",
  "priority": "HIGH"
}
```

### Update status

```json
{
  "status": "IN_PROGRESS"
}
```

## Assets

- `GET /assets`
- `POST /assets`
- `PUT /assets/{id}`

### Create asset

```json
{
  "name": "SRV-DB-01",
  "type": "SERVER",
  "ownerId": null,
  "ip": "10.0.0.10",
  "location": "DC-SP",
  "tags": ["database", "production"]
}
```

## Runbooks

- `GET /runbooks`
- `GET /runbooks/{id}`
- `POST /runbooks`

### Create runbook

```json
{
  "title": "Reiniciar servico de API",
  "description": "Procedimento padrão de reinicio",
  "steps": "1. Acessar servidor\n2. Reiniciar servico\n3. Validar healthcheck"
}
```

## 3.7 Mapa de autorização (RBAC)

Resumo por controller:

- Tickets:
  - `GET`/`POST`/comentarios: `ADMIN`, `TECH`, `USER`
  - `PUT`/`status`/`assign`/`link asset`: `ADMIN`, `TECH`
- Assets:
  - `GET`: `ADMIN`, `TECH`, `USER`
  - `POST`/`PUT`: `ADMIN`, `TECH`
- Runbooks:
  - `GET`: `ADMIN`, `TECH`, `USER`
  - `POST`: `ADMIN`, `TECH`

Obs importante de seguranca atual:

- `POST /auth/register` aceita role no payload.
- Isso facilita demonstracao do MVP, mas em ambiente real deve ser restringido (ex.: cadastro publico sempre `USER`, roles elevadas apenas por admin).

## 3.8 Padrão de erro da API

`GlobalExceptionHandler` retorna:

```json
{
  "timestamp": "2026-03-04T14:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "title must not be blank",
  "path": "/tickets"
}
```

## 4. Frontend (Angular 17)

## 4.1 Estrutura

```text
src/app
  core
    models
    services
    guards
    interceptors
  features
    auth
    tickets
    assets
    runbooks
    home
```

## 4.2 Fluxo de autenticação no frontend

1. Usuario faz login/register.
2. `AuthService` chama API e recebe `AuthResponse` com token.
3. Token e salvo em `localStorage` (`opsdesk_token`).
4. `authInterceptor` adiciona `Authorization: Bearer <token>` em chamadas HTTP.
5. `authGuard` protege rotas privadas.

## 4.3 Rotas

- `/login`
- `/register`
- `/home` (protegida)
- `/tickets` (protegida)
- `/assets` (protegida)
- `/runbooks` (protegida)

## 4.4 Features implementadas

### Auth

- Tela de login.
- Tela de registro com seleção de role.

### Tickets

- Criar chamado.
- Listar chamados.
- Alterar status pela tabela.

### Assets

- Criar ativo.
- Listar inventário.

### Runbooks

- Listar runbooks.
- Criar runbook se role for `ADMIN` ou `TECH`.

## 4.5 Configuracao de API URL

- Desenvolvimento: `frontend/src/environments/environment.ts`
- Producão: `frontend/src/environments/environment.prod.ts`

## 5. Infraestrutura e DevOps

## 5.1 Docker local

`infra/docker-compose.yml` sobe:

- `postgres` (porta `5432`)
- `backend` (porta `8080`)

## 5.2 Dockerfile backend

Build multi-stage:

1. Imagem Maven compila jar.
2. Imagem JRE executa jar final.

## 5.3 CI

- Backend workflow (`backend-ci.yml`): `mvn clean verify`
- Frontend workflow (`frontend-ci.yml`): `npm install && npm run build`

## 6. Como rodar no seu ambiente (SDKMAN + NVM)

## 6.1 Backend

```bash
cd backend
sdk env install
sdk env
mvn clean spring-boot:run
```

API: `http://localhost:8080`

Swagger: `http://localhost:8080/swagger-ui.html`

## 6.2 Frontend

```bash
cd frontend
nvm use
npm install
npm start
```

App: `http://localhost:4200`

## 6.3 Rodar tudo com Docker (backend + banco)

```bash
cd infra
docker compose up --build
```

## 7. Fluxos praticos com cURL

## 7.1 Criar usuario

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"Admin Ops",
    "email":"admin@opsdesk.dev",
    "password":"12345678",
    "role":"ADMIN"
  }'
```

## 7.2 Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@opsdesk.dev","password":"12345678"}'
```

Guarde o token retornado e use nos próximos comandos.

## 7.3 Criar chamado

```bash
curl -X POST http://localhost:8080/tickets \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Impressora sem papel",
    "description":"Andar 3 sem reposição",
    "priority":"LOW"
  }'
```

## 7.4 Criar ativo

```bash
curl -X POST http://localhost:8080/assets \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"NB-123",
    "type":"NOTEBOOK",
    "ownerId":null,
    "ip":"10.1.2.3",
    "location":"Sala 2",
    "tags":["rh","windows"]
  }'
```

## 7.5 Criar runbook

```bash
curl -X POST http://localhost:8080/runbooks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Troca de senha AD",
    "description":"Passo a passo de reset",
    "steps":"1) Abrir ADUC\n2) Buscar usuario\n3) Resetar senha"
  }'
```

## 8. Estado atual (checklist)

Implementado:

- Autenticação JWT.
- RBAC com 3 perfis.
- CRUD principal de Tickets (sem delete).
- CRUD principal de Assets (sem delete).
- CRUD principal de Runbooks (create/list/get).
- Comentarios em tickets.
- Associacao de ativos em tickets.
- Frontend funcional do MVP.
- Migração inicial com Flyway.
- Docker local para backend + banco.
- CI basico backend/frontend.

Ainda não implementado:

- Testes unitarios de use case/controller (alem de teste de contexto).
- Refresh token e revogacao de token.
- Controle de ownership por usuario em tickets.
- Paginação/filtros avancados.
- Auditoria e SLA.
- Deploy automatico completo (workflows estao basicos).

## 9. Pontos de atenção tecnicos

1. Registro com role livre (`/auth/register`) e pratico para demo, mas inseguro para produção.
2. Token no `localStorage` e simples, mas tem trade-offs de seguranca.
3. Frontend ainda não cobre todos os endpoints (ex.: assign/comment/link asset via UI).
4. Sem testes de negócio, regressão pode passar despercebida.

## 10. Roadmap de estudo (para voce evoluir no Java)

Ordem recomendada:

1. Entenda `Controller -> UseCase -> RepositoryPort -> Adapter`.
2. Estude `SecurityConfig` e `JwtAuthenticationFilter`.
3. Rode os endpoints no Swagger e compare com codigo dos controllers.
4. Escreva 1 teste unitario para `AuthUseCase`.
5. Escreva 1 teste para `TicketUseCase.updateStatus` cobrindo regra de `IN_PROGRESS` sem assignee.
6. Refatore `register` para bloquear roles elevadas em cadastro publico.
7. Adicione endpoint de administracao para criar usuarios TECH/ADMIN com seguranca.

## 11. Glossario rapido

- DTO: objeto de transferencia para API (entrada/saida).
- Use case: regra de negocio da aplicacao.
- Port: contrato (interface) usado pela regra de negocio.
- Adapter: implementacao concreta de um port.
- Entity (dominio): modelo de negocio.
- JPA Entity: modelo de persistencia para banco relacional.
- JWT: token assinado que representa o usuario logado.
- RBAC: controle de acesso baseado em papeis.

---

Se quiser, no proximo passo eu posso criar uma versao 2 desta doc com diagramas de sequencia por fluxo (`login`, `create ticket`, `update status`) e um "roteiro de exercicios" para voce praticar alteracoes reais no codigo.
