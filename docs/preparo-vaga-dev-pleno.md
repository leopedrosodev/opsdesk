# Preparo para vaga Dev Pleno

Ultima atualizacao: 2026-03-13

## Objetivo

Usar o OpsDesk como projeto de treino para entrevistas de desenvolvimento pleno com foco em Angular, Java/Spring e maturidade de entrega.

## O que este projeto ja demonstra

| Requisito da vaga | Evidencia no projeto |
|---|---|
| Angular 8+ / TypeScript / HTML / CSS | Frontend em Angular 17 com componentes standalone, rotas protegidas, forms reativos e design responsivo. |
| RxJS | Fluxos HTTP, auth reativa com `BehaviorSubject`, dashboard consumindo resumo operacional via stream reativa. |
| Java / Spring Boot / JPA / Hibernate | Backend em Java 17, Spring Boot 3, JPA/Hibernate, Flyway, Spring Security com JWT. |
| REST | CRUDs de auth, tickets, assets, runbooks e endpoint agregado `GET /dashboard/summary`. |
| Docker | `backend/Dockerfile` e `infra/docker-compose.yml`. |
| CI/CD | Workflows em `.github/workflows`. |

## O que ainda vale evoluir para ficar mais alinhado com a vaga

### Frontend

- Implementar estado global com NgRx para tickets e autenticacao.
- Adicionar `ngx-translate` com pelo menos `pt-BR` e `en-US`.
- Incorporar Angular Material ou PrimeNG em uma tela chave sem descaracterizar a UX.
- Criar testes de integracao mais fortes para componentes de feature.
- Preparar um fluxo E2E legado com Protractor apenas para treino de vaga, mesmo que o ecossistema atual use Cypress/Playwright no mercado.

### Backend e integracao

- Expor uma camada GraphQL para leitura de dashboard, tickets e assets.
- Adicionar testes de integracao com contexto Spring e banco temporario.
- Criar um endpoint de busca/filtro mais realista para tickets por status, prioridade e assignee.

### DevOps e cloud

- Adaptar deploy para AWS:
  - backend em servico gerenciado
  - frontend em S3 + CloudFront
  - banco em RDS PostgreSQL
- Publicar imagens em registry e conectar workflow de deploy.

## Roteiro de estudo sugerido

1. Refatorar tickets para NgRx com actions, reducer, effects e selectors.
2. Internacionalizar o menu e dashboard com `ngx-translate`.
3. Adicionar um cliente GraphQL no frontend para consultar um resumo operacional.
4. Subir o backend no Docker e revisar o fluxo completo localmente.
5. Treinar explicacao arquitetural: por que usar REST para escrita e GraphQL para leitura agregada.

## Como vender o projeto na entrevista

- Explique que ele nao e apenas CRUD: existe autenticacao JWT, RBAC, clean architecture e preocupacao com deploy.
- Mostre a separacao entre `domain`, `application`, `infrastructure` e `api` no backend.
- Mostre no frontend a diferenca entre componentes de feature, services, guards e interceptors.
- Use o dashboard agregado para falar de performance, reducao de round-trips e design de API para telas analiticas.
