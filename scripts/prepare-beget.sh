#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
TEMPLATE_DIR="$ROOT_DIR/deploy/beget-template/public_html"
OUTPUT_DIR="$ROOT_DIR/deploy/beget/public_html"

npm --prefix "$FRONTEND_DIR" run build

mkdir -p "$OUTPUT_DIR"
rsync -a --delete "$TEMPLATE_DIR/" "$OUTPUT_DIR/"
rsync -a \
  --exclude '.DS_Store' \
  --exclude '.gitkeep' \
  "$FRONTEND_DIR/dist/" "$OUTPUT_DIR/"

touch "$OUTPUT_DIR/api/storage/submissions.jsonl"

echo "Beget package is ready:"
echo "$OUTPUT_DIR"
