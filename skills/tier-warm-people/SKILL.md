---
name: tier-warm-people
description: "Add a fit score column, quote one row, tier the warm people, and draft a LinkedIn sequence for tier 2. Use after the rollup. It does not enroll."
---

# Tier warm people

Follow `docs/skill-frame.md`.

## Use when

Warm people already exist and you want tiers. Not for the first harvest. Not for sending the tier 1 note.

## Steps

1. Add the fit column (`references/fit-column.md`).
2. Quote one row, then run inside the ceiling (`references/quote.md`).
3. Apply tiers and upsert the tier and the reason (`references/tiers.md`).
4. Draft a sequence for tier 2 only (`references/draft.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `tables.columns.add` | dry_run | yes |
| 2 | `tables.columns.run` | dry_run | yes |
| 3 | `tables.rows.upsert` | dry_run | yes |
| 4 | `sequence.sequences.create_from_worksheet` | dry_run | yes |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
