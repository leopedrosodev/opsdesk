#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"
ENV_EXAMPLE="$ROOT_DIR/.env.local.example"

usage() {
  echo "Uso: $0 [up|down]"
  echo ""
  echo "  up    Sobe PostgreSQL, backend e frontend"
  echo "  down  Para o PostgreSQL local"
}

load_env() {
  if [ ! -f "$ENV_FILE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo "Criado .env.local a partir de .env.local.example"
  fi

  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
}

stop_children() {
  if [ -n "${BACKEND_PID:-}" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [ -n "${FRONTEND_PID:-}" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

run_up() {
  load_env

  "$ROOT_DIR/scripts/db.sh" up

  echo "Subindo backend em http://localhost:${PORT:-8080}"
  (
    cd "$ROOT_DIR/backend"
    mvn spring-boot:run
  ) &
  BACKEND_PID=$!

  echo "Subindo frontend em http://localhost:4200"
  (
    cd "$ROOT_DIR/frontend"
    if [ ! -d node_modules ]; then
      npm ci
    fi
    npm start
  ) &
  FRONTEND_PID=$!

  trap stop_children INT TERM EXIT

  echo ""
  echo "OpsDesk local:"
  echo "  Frontend: http://localhost:4200"
  echo "  API:      http://localhost:${PORT:-8080}"
  echo "  Swagger:  http://localhost:${PORT:-8080}/swagger-ui.html"
  echo ""
  echo "Pressione Ctrl+C para parar backend e frontend."

  wait "$BACKEND_PID" "$FRONTEND_PID"
}

case "${1:-up}" in
  up)
    run_up
    ;;
  down)
    "$ROOT_DIR/scripts/db.sh" down
    ;;
  *)
    usage
    exit 1
    ;;
esac
