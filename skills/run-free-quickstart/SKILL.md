---
name: run-free-quickstart
description: "Run the free five minute check: identity, a search, one contract, engaged sources with prices, and spend in the last hour. An optional sandbox workbook waits for a yes. Use before the first paid play."
---

# Run free quickstart

Follow `docs/skill-frame.md`.

## Use when

You want proof the workspace is wired and that this check spent 0 credits. Not for a real list.

## Steps

1. Call whoami and confirm the workspace (`references/identity.md`).
2. Search tables for a verified work email and show the top three (`references/search.md`).
3. Fetch the verify email contract and say the cost in plain words (`references/verify.md`).
4. List engaged sources and their per-row prices (`references/catalog.md`).
5. Read status and spend since one hour ago (`references/spend.md`).
6. Optional sandbox workbook only after a yes (`references/sandbox.md`).
7. Save the responses and run check-quickstart (`references/check.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `whoami` | live | no |
| 2 | `tools_search` | live | no |
| 3 | `tools_get` | live | no |
| 4 | `tables.findable_catalog.list` | live | no |
| 5 | `workspace.usage.status_get` | live | no |
| 5 | `workspace.usage.spend_breakdown` | live | no |
| 6 | `tables.workbooks.create` | dry_run | yes |
| 6 | `tables.rows.create_many` | dry_run | yes |
| 6 | `tables.rows.query` | live | no |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
