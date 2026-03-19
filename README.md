# OpsDesk

Sistema de Service Desk para gerenciamento de chamados, ativos e runbooks de TI.

> **Autor:** Leonardo Pedroso

> **Demo ao vivo:** [opsdesk-6y3.pages.dev](https://opsdesk-6y3.pages.dev/) &nbsp;|&nbsp; **API:** [opsdesk-qam9.onrender.com](https://opsdesk-qam9.onrender.com/swagger-ui.html)

---

## Funcionalidades

- Autenticação com JWT e controle de acesso por perfil (ADMIN, TECH, USER)
- Criação e gerenciamento de chamados com prioridade e status
- Atribuição de chamados a técnicos
- Comentários em chamados
- Gerenciamento de ativos de TI com tags e localização
- Vinculação de ativos a chamados
- Runbooks operacionais
- Dashboard com resumo operacional agregado
- Tema claro/escuro

## Stack

| Camada | Tecnologias |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Security, JWT, JPA/Hibernate, Flyway |
| Frontend | Angular 17, TypeScript, RxJS, Reactive Forms |
| Banco | PostgreSQL |
| Infra | Docker, Docker Compose, GitHub Actions |
| Deploy | Render (API) + Cloudflare Pages (Frontend) |

## Arquitetura

O backend segue **Clean Architecture** (Hexagonal), separando domínio, casos de uso, infraestrutura e API em camadas independentes:

```
backend/src/main/java/com/opsdesk/
├── domain/          # Entidades e contratos de repositório (puras, sem dependências)
├── application/     # Casos de uso e ports (interfaces)
├── infrastructure/  # Adaptadores JPA, Spring Security
└── api/             # Controllers, DTOs, mappers, exception handlers
```

Essa estrutura permite testar os casos de uso com Mockito **sem subir o Spring context ou banco de dados**.

## Testes

Testes unitários dos casos de uso com JUnit 5 + Mockito:

```bash
cd backend
mvn test -Dtest="AuthUseCaseTest,TicketUseCaseTest,AssetUseCaseTest"
```

Cenários cobertos: happy path, entidade não encontrada, validações de negócio (ex: ticket sem assignee não pode ir para IN_PROGRESS, apenas TECH/ADMIN pode ser assignee).

## Treino para vaga pleno

O repositório também foi ajustado para servir como laboratório de entrevista:

- Dashboard fullstack com endpoint agregado em `/dashboard/summary`
- Plano objetivo de evolução em `docs/preparo-vaga-dev-pleno.md`

## Como rodar local

**Pré-requisitos:** Java 17+, Node.js 20+, Docker

```bash
# 1. Subir o banco
./scripts/db.sh up

# 2. Subir o backend
cd backend
mvn spring-boot:run

# API em http://localhost:8080
# Swagger em http://localhost:8080/swagger-ui.html

# 3. Subir o frontend
cd frontend
npm install
npm start

# Frontend em http://localhost:4200
```

### Comandos do banco

```bash
./scripts/db.sh up       # sobe o PostgreSQL via Docker
./scripts/db.sh down     # para e remove o container
./scripts/db.sh restart  # reinicia o container
./scripts/db.sh status   # verifica se o banco está pronto
./scripts/db.sh logs     # exibe os logs do container
```

## Variáveis de ambiente (backend)

Veja `backend/.env.example`.

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Login e geração de JWT |
| GET/POST | `/tickets` | Listar e criar chamados |
| PUT | `/tickets/{id}` | Atualizar chamado |
| PATCH | `/tickets/{id}/status` | Alterar status |
| PATCH | `/tickets/{id}/assign/{assigneeId}` | Atribuir técnico |
| POST | `/tickets/{id}/comments` | Adicionar comentário |
| GET/POST | `/assets` | Listar e criar ativos |
| GET/POST | `/runbooks` | Listar e criar runbooks |

Documentação interativa completa: [swagger-ui.html](https://opsdesk-qam9.onrender.com/swagger-ui.html)
