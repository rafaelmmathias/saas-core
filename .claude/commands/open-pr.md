# Open Pull Request

You are helping the user open a GitHub pull request for the current branch in the
saas-core monorepo. Follow every step below in order. Do not skip ahead.

---

## Step 1 — Collect git information

Run the helper script from the repo root:

```bash
bash scripts/git-pr-info.sh
```

Parse the output using the `=== LABEL ===` section delimiters:
- **BRANCH** — the current branch name
- **REMOTE_URL** — must contain `github.com`; if not, abort and tell the user this command only works with GitHub remotes
- **DIRTY_FILES** — raw output of `git status --short`
- **COMMITS_AHEAD** — lines of `<hash> <subject>` commits ahead of `main`
- **DIFF_STAT** — output of `git diff --shortstat` (e.g. `3 files changed, 120 insertions(+), 45 deletions(-)`)

---

## Step 2 — Check for uncommitted changes

If **DIRTY_FILES** is non-empty:

1. Show the user the dirty files as a list
2. Say: "You have uncommitted or untracked changes. Please commit or stash them before opening a PR."
3. **Stop here. Do not continue.**

---

## Step 3 — Show the commit table

If **COMMITS_AHEAD** is empty, say: "There are no commits ahead of `main`. Nothing to PR." Then stop.

Otherwise, display a markdown table of commits that will be in the PR (newest first):

| Hash | Commit message |
|------|----------------|
| abc1234 | feat: add user authentication |

---

## Step 4 — Generate PR title and description

Using only the commit list, generate:

**Title** — Single concise sentence, ≤72 characters, conventional commit style (`type: short description`). No branch name or ticket number.

**Description** — Use exactly this structure:

```
## Summary

- <bullet per logical change — group related commits, not one bullet per commit>

## Test plan

- [ ] <what a reviewer should manually verify>
- [ ] <additional check if relevant>

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
```

Rules:
- Summary bullets describe *what changed and why*, not just the commit subject
- Test plan should reflect the actual changes (if purely mechanical, say so)
- Do not fabricate details not present in the commit messages

---

## Step 5 — Show PR preview and confirm

Print the preview using this markdown layout (render it as markdown, not inside a code block):

---

## PR Preview

| Field | Value |
| --- | --- |
| **Title** | `<generated title>` |
| **Target** | `<current branch>` → `main` |
| **Changes** | `<DIFF_STAT value>` |

## Summary

- bullet per logical change (group related commits, not one per commit)

## Test plan

- [ ] what a reviewer should manually verify

---

Ask: "Does this look good? Type **yes** to create the PR, or describe any changes you want."

If the user requests changes, revise and reprint the preview. Repeat until approved.

---

## Step 6 — Create the PR

Once approved:

**6a.** Compare the local HEAD with what is on the remote:

```bash
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git ls-remote origin refs/heads/<branch> | cut -f1)
```

If `REMOTE` is empty (branch does not exist) or `LOCAL != REMOTE` (local has unpushed commits), push first:

```bash
git push -u origin <branch>
```

Tell the user: "Pushing branch to remote…" before running it.

**6b.** Create the PR:

```bash
gh pr create \
  --base main \
  --title "<approved title>" \
  --body "$(cat <<'PRBODY'
<approved description>
PRBODY
)"
```

- On success: print the PR URL
- On failure: show the full error output

Common failure causes:
- Not authenticated → tell user to run `gh auth login`
- PR already exists for this branch → show the existing PR URL

---

## Constraints

- **Never** run `git merge`, or modify any repo files
- Only push the branch (Step 6a) if it does not yet exist on the remote — never force-push
- Target base branch is always `main`
- Do not add labels, reviewers, or assignees unless the user explicitly asks
- Do not re-run the helper script after Step 1 — use only the data already collected
