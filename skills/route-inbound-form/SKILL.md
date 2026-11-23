---
name: route-inbound-form
description: "Attach a webhook that requires a secret, assert a CRM record when the person is new, and sync one record only after a yes. Use for inbound forms. It does not sync a batch on its own."
---

# Route inbound form

Follow `docs/skill-frame.md`.

## Use when

A form should land in the CRM. The Dreamstate skill for records is `dreamstate-crm`. Not for a cold list, and not for a second sync of a row that is already queued.

## Steps

1. Read the webhook card, then attach `source.webhook_source` with require_secret true (`references/webhook.md`).
2. Normalise the email and hold bad rows (`references/normalise.md`).
3. Search the CRM and classify the match (`references/class.md`).
4. List record object types, then assert a record when next is assert_record (`references/assert.md`).
5. Read the connected provider, then sync one record (`references/sync.md`).
6. Read health again and do not call queued done (`references/health.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `tables.table_sources.attach` | dry_run | yes |
| 3 | `crm.records.search` | live | no |
| 4 | `crm.record_objects.list` | live | no |
| 4 | `crm.records.assert` | dry_run | yes |
| 5 | `integrations.health_get` | live | no |
| 5 | `integrations.sync` | dry_run | yes |
| 6 | `integrations.health_get` | live | no |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
