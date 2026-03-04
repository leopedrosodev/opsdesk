# Plano de Implementacao - OpsDesk

Ultima atualizacao: 2026-03-04

## 1. Objetivo deste documento

Consolidar o estado atual do projeto e definir o plano pratico para colocar o MVP totalmente online.

## 2. Status atual (resumo)

- Estado geral: MVP funcional em desenvolvimento local.
- Frontend: deploy inicial no Cloudflare Pages concluido.
- Backend em nuvem: pendente de validacao final no Render.
- Banco em nuvem: pendente de configuracao final no Neon + Render.

## 3. O que ja foi feito

### 3.1 Estrutura e base do projeto

- [x] Monorepo com `backend`, `frontend`, `infra`, `docs`.
- [x] Guia principal e documentacao de estudo criados.
- [x] Plano de estudo por sessoes criado.

### 3.2 Backend (Spring Boot)

- [x] Java 17 + Spring Boot configurados.
- [x] Arquitetura por camadas (`domain`, `application`, `infrastructure`, `api`).
- [x] Flyway com migracao inicial (`V1__init.sql`).
- [x] JWT + RBAC (`ADMIN`, `TECH`, `USER`).
- [x] Endpoints MVP implementados:
  - [x] `POST /auth/register`
  - [x] `POST /auth/login`
  - [x] Tickets: list/create/update/status/assign/comments/link asset
  - [x] Assets: list/create/update
  - [x] Runbooks: list/create/view
- [x] Dockerfile do backend pronto.
- [x] Health endpoint implementado.

### 3.3 Frontend (Angular 17)

- [x] Estrutura por feature (`auth`, `tickets`, `assets`, `runbooks`).
- [x] Router + guard + interceptor JWT.
- [x] Forms e servicos para consumo da API.
- [x] `environment.prod.ts` apontando para API de producao (placeholder atual de Render).
- [x] Deploy inicial em Cloudflare Pages realizado (`opsdesk-k6y3.pages.dev`).

### 3.4 Infra e CI

- [x] `docker-compose` para ambiente local.
- [x] CI backend (`mvn clean verify`).
- [x] CI frontend (`npm install && npm run build`).
- [x] Config base de servico Render em `infra/render.yaml`.

## 4. O que falta fazer (prioridade)

### P0 - Colocar MVP 100% online e usavel

- [ ] Criar projeto PostgreSQL no Neon (producao).
- [ ] Configurar variaveis no Render:
  - [ ] `SPRING_DATASOURCE_URL` (com SSL quando exigido pelo Neon)
  - [ ] `SPRING_DATASOURCE_USERNAME`
  - [ ] `SPRING_DATASOURCE_PASSWORD`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRATION_MINUTES`
- [ ] Subir backend no Render e validar:
  - [ ] `GET /health`
  - [ ] Swagger (`/swagger-ui.html`)
  - [ ] login/register
- [ ] Confirmar URL final do backend Render e ajustar `frontend/src/environments/environment.prod.ts` se necessario.
- [ ] Fazer novo deploy do frontend no Pages com API final.
- [ ] Smoke test completo em producao:
  - [ ] Registrar usuario
  - [ ] Login
  - [ ] Criar ticket
  - [ ] Criar asset
  - [ ] Criar runbook

### P1 - Qualidade e seguranca minima para portfolio

- [ ] Implementar testes unitarios de use case:
  - [ ] `AuthUseCase` (email duplicado, senha invalida, login invalido)
  - [ ] `TicketUseCase` (regras de status e assignee)
- [ ] Ajustar regra de cadastro publico para sempre criar `USER` (hardening de role no register).
- [ ] Restringir CORS por ambiente (em vez de origem aberta para `*`).
- [ ] Revisar mensagens de erro da API para manter padrao consistente.

### P2 - Entrega profissional (portfolio)

- [ ] CI/CD de deploy automatico:
  - [ ] backend -> Render
  - [ ] frontend -> Cloudflare Pages
- [ ] Adicionar badge de status no `README.md`.
- [ ] Definir dominio custom (opcional), mantendo `pages.dev` como fallback.
- [ ] Criar roteiro de demonstracao (video curto ou passo a passo com prints).

## 5. Plano de implementacao por fases

### Fase 1 - Backend online (Render + Neon)

Objetivo: deixar API publica, estavel e conectada ao banco.

Entregaveis:
- URL da API em producao.
- `GET /health` respondendo 200.
- Migracoes Flyway aplicadas no banco remoto.

### Fase 2 - Integracao frontend em producao

Objetivo: frontend publicado consumindo a API real.

Entregaveis:
- URL do Cloudflare Pages funcionando com login real.
- Fluxo basico do MVP validado em producao.

### Fase 3 - Hardening + testes

Objetivo: elevar confiabilidade tecnica.

Entregaveis:
- Testes unitarios cobrindo regras principais.
- Hardening de register e CORS.

### Fase 4 - CI/CD e acabamento de portfolio

Objetivo: demonstrar maturidade de engenharia no portfolio.

Entregaveis:
- Pipelines de build/deploy automatizados.
- README final com links publicos e instrucoes de demo.

## 6. Definicao de pronto (MVP online)

Considerar MVP pronto quando todos os itens abaixo estiverem concluidos:

- [ ] Frontend acessivel em URL publica.
- [ ] Backend acessivel em URL publica.
- [ ] Banco remoto persistindo dados.
- [ ] Fluxo login -> criar ticket -> listar ticket funcionando em producao.
- [ ] Pelo menos 1 teste unitario por use case critico.
- [ ] Documentacao atualizada com links finais.
