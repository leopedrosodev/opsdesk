# OpsDesk Backend

API REST do OpsDesk em Spring Boot 3.

## Rodar localmente

```bash
mvn clean spring-boot:run
```

## Build

```bash
mvn clean verify
```

## Arquitetura

```text
src/main/java/com/opsdesk
  domain
    entities
    repositories
  application
    usecases
    ports
  infrastructure
    persistence
    security
  api
    controllers
    dto
    mappers
```

## Migrations

Flyway em `src/main/resources/db/migration`.
