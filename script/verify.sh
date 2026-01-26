#!/bin/bash
# script/verify.sh
# Pre-push verification script - mirrors GitHub CI workflow
# Install as pre-push hook: cp script/verify.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push

set -e

ROOT_DIR="$(git rev-parse --show-toplevel)"

echo "=== Running CI checks locally ==="

echo ">>> Backend Lint (RuboCop)"
cd "$ROOT_DIR/backend" && bundle exec rubocop

echo ">>> Backend Tests (RSpec)"
bundle exec rspec --format documentation

echo ">>> Frontend Lint (Prettier + ESLint)"
cd "$ROOT_DIR/frontend" && npm run prettier && npm run lint

echo ">>> Frontend Tests (Jest)"
npm test -- --ci --runInBand --watchAll=false

echo ">>> Frontend Build"
npm run build

echo "=== All CI checks passed ==="
