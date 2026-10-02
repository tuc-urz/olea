#!/usr/bin/env bash

set -euo pipefail

ARG="${1:-patch}"
PKG="packages/package.json"

if [ ! -f "$PKG" ]; then
  echo "error: $PKG not found — run from repo root" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq required (brew install jq)" >&2
  exit 1
fi

CUR=$(jq -r .version "$PKG")
(cd packages && npm version "$ARG" --no-git-tag-version --workspaces-update=false >/dev/null)
NEW=$(jq -r .version "$PKG")

echo "Bumping @olea-bps/base: $CUR -> $NEW"

CONSUMERS=$(grep -rl '"@olea-bps/base"' apps --include=package.json || true)
for f in $CONSUMERS; do
  jq ".dependencies[\"@olea-bps/base\"] = \"^$NEW\"" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  echo "  updated $f"
done

git add "$PKG" $CONSUMERS
git commit -m "chore: bump @olea-bps/base to $NEW"
git log --oneline -n 3
