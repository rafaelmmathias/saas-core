#!/usr/bin/env bash
# scripts/git-pr-info.sh
# Collects all git state needed for /open-pr in one shot.
# Output uses === LABEL === section delimiters for reliable parsing.

set -euo pipefail

MAIN_BRANCH="main"

echo "=== BRANCH ==="
git rev-parse --abbrev-ref HEAD

echo ""
echo "=== REMOTE_URL ==="
git remote get-url origin 2>/dev/null || echo "(no remote)"

echo ""
echo "=== DIRTY_FILES ==="
git status --short

echo ""
echo "=== COMMITS_AHEAD ==="
git log --oneline "${MAIN_BRANCH}..HEAD"
