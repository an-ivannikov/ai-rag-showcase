#!/usr/bin/env bash
set -euo pipefail

# Requires Graphviz installed: brew install graphviz  OR  apt-get install graphviz
DOT_FILE="${1:-architecture.dot}"
OUT_PNG="${2:-architecture.png}"
OUT_SVG="${3:-architecture.svg}"

if ! command -v dot >/dev/null 2>&1; then
  echo "Error: graphviz 'dot' is not installed."
  exit 1
fi

dot -Tpng "$DOT_FILE" -o "$OUT_PNG"
dot -Tsvg "$DOT_FILE" -o "$OUT_SVG"
echo "Generated: $OUT_PNG and $OUT_SVG"
