# Plano de Entrevista - Dev Pleno

Ultima atualizacao: 2026-03-13

## Objetivo

Treinar respostas tecnicas e apresentacao do projeto OpsDesk para uma vaga com foco em Angular, Java/Spring, integracoes e entrega de software.

## Resumo do projeto para falar em 30 segundos

O OpsDesk e um sistema de service desk com Angular 17 no frontend e Java 17 + Spring Boot no backend. O projeto tem autenticacao JWT com RBAC, arquitetura em camadas no backend, CRUDs de tickets, assets e runbooks, paginacao, testes unitarios e infraestrutura com Docker e CI. Recentemente foi adicionada uma camada de resumo operacional para dashboard, o que ajuda a demonstrar design de API orientado a produto e nao so CRUD.

## Resumo do que foi melhorado agora

1. Foi criado um endpoint agregado de dashboard no backend para expor indicadores operacionais sem obrigar o frontend a fazer varias chamadas.
2. O dashboard Angular passou a consumir esse resumo com fluxo reativo, estados de loading/erro e uma interface mais alinhada com um sistema real.
3. O modulo de runbooks foi alinhado com a paginacao do backend.
4. Foi criado um guia de preparo da vaga para mapear o que o projeto ja cobre e o que ainda falta estudar.

## Pitch de 2 minutos

1. Comece pelo problema:
   O projeto simula uma plataforma de service desk para gerenciar chamados, inventario e conhecimento operacional.
2. Explique a arquitetura:
   No backend eu separei dominio, casos de uso, infraestrutura e API. No frontend organizei por features, services, guardas e interceptor.
3. Mostre regras reais:
   Existe JWT com RBAC, validacoes de negocio para tickets e fluxo de comentarios.
4. Mostre preocupacao com produto:
   Criei um resumo operacional no dashboard para reduzir round-trips e entregar uma tela mais analitica.
5. Feche com engenharia:
   O projeto usa testes, Docker e CI para dar previsibilidade de entrega.

## Perguntas que provavelmente vao cair

### Angular

1. Como voce organiza uma aplicacao Angular maior?
   Resposta esperada: por feature, separando componentes, services, models, guards e interceptors; evitar acoplamento global cedo demais.
2. Onde entra RxJS no seu projeto?
   Resposta esperada: fluxo HTTP, auth reativa com `BehaviorSubject`, composicao de estado async no dashboard, tratamento de erro e loading.
3. Quando voce usaria NgRx?
   Resposta esperada: quando houver estado compartilhado complexo, efeitos, cache, auditoria de transicoes e multiplas telas reagindo ao mesmo estado.
4. Como voce lida com autenticacao no Angular?
   Resposta esperada: service para persistir token, interceptor para anexar bearer token, guard para proteger rota e logout limpando storage.
5. Como voce melhoraria esse frontend para essa vaga?
   Resposta esperada: NgRx para auth/tickets, `ngx-translate`, testes de integracao e adocao de Angular Material ou PrimeNG em pontos estrategicos.

### Java / Spring

1. Por que separar `domain`, `application`, `infrastructure` e `api`?
   Resposta esperada: isolar regra de negocio, reduzir acoplamento com framework e facilitar teste.
2. Onde ficam as regras de negocio?
   Resposta esperada: nos use cases e entidades de dominio; controller apenas recebe e devolve dados.
3. Como funciona sua autenticacao?
   Resposta esperada: login gera JWT, filtro valida token a cada request, Spring Security popula contexto e RBAC restringe acesso.
4. Como voce usa JPA/Hibernate sem poluir dominio?
   Resposta esperada: entidades JPA separadas das entidades de dominio, com mappers e adapters.
5. O que voce faria para escalar esse backend?
   Resposta esperada: indices e filtros melhores, cache em leituras quentes, endpoints agregados, observabilidade, filas para trabalhos assincronos e deploy horizontal.

### APIs / Integracao

1. Por que criar um endpoint agregado de dashboard?
   Resposta esperada: reduzir round-trips, centralizar regras de agregacao e deixar a tela mais simples.
2. Quando usar REST e quando usar GraphQL?
   Resposta esperada: REST funciona muito bem para comandos e recursos bem definidos; GraphQL pode ajudar em leituras agregadas e telas com composicao dinamica.
3. Como voce trataria erros de integracao?
   Resposta esperada: contratos claros, status codes corretos, tratamento global e mensagens consistentes para frontend.

### Entrega / DevOps

1. O que voce sabe de Docker?
   Resposta esperada: empacotar servico, padronizar ambiente, facilitar CI e deploy.
2. Como voce levaria isso para AWS?
   Resposta esperada: backend em um servico gerenciado, frontend estatico com CDN, banco PostgreSQL gerenciado, secrets fora do codigo e pipeline automatizado.

## Respostas praticas para vender maturidade

- Eu tento evitar acoplar regra de negocio ao framework para manter teste e manutencao simples.
- Quando a tela precisa de varios dados ao mesmo tempo, prefiro pensar em contrato de API orientado a caso de uso e nao so em CRUD isolado.
- Eu trato autenticacao e autorizacao como parte de arquitetura, nao so como detalhe de controller.
- Mesmo quando ainda nao subi tudo em cloud produtiva, eu gosto de deixar o caminho de deploy visivel no repositorio.

## Pontos fracos que voce pode admitir sem se sabotar

- Ainda nao implementei NgRx, mas sei exatamente onde ele agregaria valor neste projeto.
- Ainda nao coloquei GraphQL, mas usei o dashboard agregado justamente como ponte para essa evolucao.
- O projeto ainda pode ganhar mais testes de integracao e E2E.

## Treino de 5 dias

### Dia 1 - Pitch e arquitetura

1. Treinar apresentacao de 30 segundos e de 2 minutos.
2. Explicar o fluxo de `POST /tickets` ponta a ponta.
3. Explicar JWT + RBAC sem olhar codigo.

### Dia 2 - Angular

1. Explicar `auth.service.ts`, `auth.guard.ts` e `auth.interceptor.ts`.
2. Explicar onde RxJS aparece no projeto.
3. Treinar resposta para "quando usar NgRx?".

### Dia 3 - Spring e persistencia

1. Explicar diferenca entre entidade de dominio e entidade JPA.
2. Explicar o papel dos adapters e repositories.
3. Explicar Flyway e por que usar migracao versionada.

### Dia 4 - APIs e dashboard

1. Explicar por que o endpoint `/dashboard/summary` existe.
2. Treinar comparacao REST vs GraphQL.
3. Simular pergunta sobre performance e escalabilidade.

### Dia 5 - DevOps e fechamento

1. Explicar `docker-compose.yml`.
2. Treinar como levar o projeto para cloud sem entrar em detalhe de orquestrador.
3. Fazer uma entrevista simulada completa de 30 minutos.

## Checklist antes da entrevista

- Revisar `README.md`
- Revisar `docs/preparo-vaga-dev-pleno.md`
- Revisar `docs/plano-de-estudo.md`
- Conseguir explicar o dashboard novo sem ler codigo
- Conseguir explicar 3 decisoes tecnicas e 3 proximos passos do projeto

## Arquivos para revisar

- `frontend/src/app/features/dashboard/dashboard.component.ts`
- `frontend/src/app/core/services/auth.service.ts`
- `frontend/src/app/core/interceptors/auth.interceptor.ts`
- `backend/src/main/java/com/opsdesk/application/usecases/DashboardUseCase.java`
- `backend/src/main/java/com/opsdesk/application/usecases/TicketUseCase.java`
- `backend/src/main/java/com/opsdesk/infrastructure/security/SecurityConfig.java`
