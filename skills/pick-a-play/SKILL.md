---
name: pick-a-play
description: "Read readiness and the source catalog, then suggest one play to switch on next with its cost and its yes items. Use when the owner asks what to turn on. It does not enable anything."
---

# Pick a play

Follow `docs/skill-frame.md`.

## Use when

The workspace is signed in and you want one next play, not a tour of all six.

## Steps

1. Read whoami readiness and stop if the workspace is wrong (`references/readiness.md`).
2. Read the catalog for the play you might suggest (`references/catalog.md`).
3. Name one play, its cost, and every yes (`references/choose.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `whoami` | live | no |
| 2 | `tables.findable_catalog.list` | live | no |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
