---
name: route-inbound-form
description: "Attach a webhook that requires a secret, classify the CRM match, and sync one record only after a yes. Use for inbound forms. It does not sync a batch on its own."
---

# Route inbound form

Follow `docs/skill-frame.md`.

## Use when

A form should land in the CRM. Not for a cold list, and not for a second sync of a row that is already queued.

## Steps

1. Read the webhook card and require a secret (`references/webhook.md`).
2. Normalise the email and hold bad rows (`references/normalise.md`).
3. Search the CRM and classify the match (`references/class.md`).
4. Preview the CRM write (`references/preview.md`).
5. Sync one approved record (`references/sync.md`).
6. Read health and do not call queued done (`references/health.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `tables.findable_catalog.list` | live | no |
| 3 | `crm.records.search` | live | no |
| 4 | `integrations.crm_management_preview` | live | no |
| 5 | `integrations.sync` | dry_run | yes |
| 6 | `integrations.health_get` | live | no |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
