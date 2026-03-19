#!/usr/bin/env bash
set -e

COMPOSE_FILE="$(dirname "$0")/../infra/docker-compose.yml"
CONTAINER="opsdesk-postgres"

usage() {
  echo "Uso: $0 [up|down|restart|status|logs]"
  echo ""
  echo "  up       Sobe o banco (em background)"
  echo "  down     Para e remove o container"
  echo "  restart  Reinicia o container"
  echo "  status   Mostra se o banco está pronto para conexão"
  echo "  logs     Exibe os logs do container"
}

case "$1" in
  up)
    echo "Subindo o banco..."
    docker compose -f "$COMPOSE_FILE" up -d postgres
    echo "Aguardando o PostgreSQL ficar pronto..."
    until docker exec "$CONTAINER" pg_isready -U opsdesk -q 2>/dev/null; do
      sleep 1
    done
    echo "Banco pronto em localhost:5432"
    ;;
  down)
    echo "Parando o banco..."
    docker compose -f "$COMPOSE_FILE" stop postgres
    docker compose -f "$COMPOSE_FILE" rm -f postgres
    ;;
  restart)
    "$0" down
    "$0" up
    ;;
  status)
    docker exec "$CONTAINER" pg_isready -U opsdesk 2>&1 || echo "Container não está rodando"
    ;;
  logs)
    docker compose -f "$COMPOSE_FILE" logs -f postgres
    ;;
  *)
    usage
    exit 1
    ;;
esac
