# Plano de Estudo - OpsDesk

Plano por sessao (17 sessoes, 1h30 cada), focado no projeto atual.

## Sessao 1 - Setup e execucao local

1. Objetivo: subir tudo e entender o fluxo basico.
2. Pratica: rodar backend e frontend com `sdkman` + `nvm`.
3. Arquivos: `README.md`, `docs/GUIA-COMPLETO.md`.
4. Resultado esperado: login funcionando no browser.

## Sessao 2 - Mapa da arquitetura backend

1. Objetivo: entender `domain -> application -> infrastructure -> api`.
2. Pratica: desenhar no papel o fluxo de `POST /tickets`.
3. Arquivos: `TicketController.java`, `TicketUseCase.java`, `TicketRepositoryPort.java`, `TicketRepositoryAdapter.java`.

## Sessao 3 - Entidades e regras de negocio

1. Objetivo: dominar modelo de dominio e regras.
2. Pratica: estudar `Ticket.updateStatus` e regra de `IN_PROGRESS` sem assignee.
3. Arquivos: `Ticket.java`, `TicketUseCase.java`.

## Sessao 4 - Persistencia com JPA + Flyway

1. Objetivo: entender tabela x entidade x mapper.
2. Pratica: mapear `users`, `tickets`, `assets`, `runbooks`.
3. Arquivos: `V1__init.sql`, `UserJpaEntity.java`, `SpringDataUserRepository.java`.

## Sessao 5 - Seguranca JWT e RBAC

1. Objetivo: entender autenticacao e autorizacao de ponta a ponta.
2. Pratica: seguir o caminho do token no codigo.
3. Arquivos: `SecurityConfig.java`, `JwtAuthenticationFilter.java`, `JwtService.java`, `AuthUseCase.java`.

## Sessao 6 - API na pratica (Swagger + curl)

1. Objetivo: testar todos os endpoints do MVP.
2. Pratica: registrar usuario, logar, criar ticket, asset, runbook.
3. Arquivos: `AuthController.java`, `AssetController.java`, `RunbookController.java`.

## Sessao 7 - Frontend: autenticacao

1. Objetivo: entender login/register, guard e interceptor.
2. Pratica: depurar fluxo de token no browser.
3. Arquivos: `auth.service.ts`, `auth.guard.ts`, `auth.interceptor.ts`, `login.component.ts`.

## Sessao 8 - Frontend: modulos de negocio

1. Objetivo: entender consumo de API nas telas.
2. Pratica: criar ticket/asset/runbook pela UI.
3. Arquivos: `tickets-page.component.ts`, `assets-page.component.ts`, `runbooks-page.component.ts`.

## Sessao 9 - Integracao e debugging

1. Objetivo: ganhar confianca para diagnosticar erros.
2. Pratica: provocar erro 400/401/403/404 e ler resposta padrao.
3. Arquivo: `GlobalExceptionHandler.java`.

## Sessao 10 - Testes backend (primeiros de verdade)

1. Objetivo: criar base de testes unitarios.
2. Pratica: testar `AuthUseCase` (login invalido, email duplicado) e `TicketUseCase.updateStatus`.
3. Arquivo inicial: `OpsDeskApplicationTests.java`.

## Sessao 11 - Hardening

1. Objetivo: melhorar seguranca e regras reais.
2. Pratica: bloquear role livre no `register` (cadastro publico vira sempre `USER`).
3. Arquivos: `RegisterRequest.java`, `AuthUseCase.java`.

## Sessao 12 - Entrega de portfolio

1. Objetivo: consolidar projeto para apresentacao.
2. Pratica: revisar README, documentacao e pipeline.
3. Arquivos: `docs/GUIA-COMPLETO.md`, `backend-ci.yml`, `frontend-ci.yml`.

## Sessao 13 - RxJS essencial no Angular

1. Objetivo: dominar operadores base para transformar e controlar fluxos.
2. Pratica: exercitar `map`, `filter`, `tap`, `switchMap`, `catchError` e `finalize` em chamadas reais.
3. Arquivos: `auth.service.ts`, `tickets.service.ts`, `runbooks.service.ts`.
4. Resultado esperado: voce entende quando encadear operadores e quando evitar subscribe aninhado.

## Sessao 14 - Fluxo HTTP reativo com loading, erro e sucesso

1. Objetivo: padronizar comportamento de tela para requisicoes async.
2. Pratica: criar estado de `loading/success/error` em pelo menos uma tela de feature.
3. Arquivos: `tickets-page.component.ts`, `assets-page.component.ts`.
4. Resultado esperado: UI previsivel, sem "travadas" e com mensagens consistentes.

## Sessao 15 - Lifecycle I (`ngOnInit` e `ngOnChanges`)

1. Objetivo: entender inicializacao e reacao a mudancas de `@Input`.
2. Pratica: criar um componente filho de filtro/lista para tickets com `@Input()` e `ngOnChanges`.
3. Arquivos: `tickets-page.component.ts` + novo componente em `shared/`.
4. Resultado esperado: saber exatamente quando cada hook dispara e por qual motivo.

## Sessao 16 - Lifecycle II (`ngOnDestroy`) e prevencao de memory leak

1. Objetivo: limpar subscriptions e recursos corretamente.
2. Pratica: implementar teardown com `takeUntilDestroyed` (Angular 17+) ou padrao equivalente.
3. Arquivos: `home.component.ts`, `dashboard.component.ts` (ou componente com stream manual).
4. Resultado esperado: componentes sem vazamento e com ciclo de vida controlado.

## Sessao 17 - Refatoracao final de front com ViewModel reativa

1. Objetivo: consolidar RxJS + lifecycle em arquitetura de UI limpa.
2. Pratica: refatorar uma tela para modelo reativo (estado por stream + efeitos controlados).
3. Arquivos: `runbooks-page.component.ts` (sugestao) e `core/services/*`.
4. Resultado esperado: codigo mais testavel, legivel e facil de evoluir.

## Como usar este plano

1. Siga uma sessao por dia.
2. Ao final de cada sessao, escreva o que aprendeu em 5 linhas.
3. Marque os itens concluidos.
4. Se travar, volte para o `docs/GUIA-COMPLETO.md` e repita os exemplos com calma.
