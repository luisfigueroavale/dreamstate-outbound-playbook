---
name: install-automation
description: "Preflight, lint, and import one graph as a disabled workflow. Enable is a separate yes. Use when the owner has picked one automation. It does not turn it on."
---

# Install automation

Follow `docs/skill-frame.md`.

## Use when

You are about to import form-to-crm, post-engagers-rollup, or comment-keyword-share. Not for editing the graph by hand in the product.

## Steps

1. Preflight the portable document (`references/preflight.md`).
2. Lint and read severity (`references/lint.md`).
3. Import only after a yes, and leave it disabled (`references/import.md`).
4. Stop before enable (`references/enable.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `workflow.automations.import_preflight` | live | no |
| 2 | `workflow.automations.lint` | live | no |
| 3 | `workflow.automations.import` | dry_run | yes |
| 4 | `workflow.workflows.enable` | dry_run | yes |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
