# Form to CRM

One inbound form becomes one CRM decision. Missing and malformed emails stop. A personal mailbox is marked and held. A duplicate of the same email and form id is held. The CRM search runs before any push. classify-crm-match is a call-plan step, not a graph node, because the graph cannot see the search results.

## When

A webhook row lands. `source.webhook_source` is 0 credits on the minimum. The catalog did not state a maximum. Set `require_secret` and `upsert_field` to email. The worksheet id is resolved at run time.

There is no form or webhook workflow trigger. `table_row_created` needs the webhook worksheet id, and that id is resolved when you import, so it is not stored in this file. The graph stays `manual_run`. The row still arrives by attaching `source.webhook_source` to that worksheet, with require_secret true.

## Cost

0 credits for the search, the preview, and the sync. The sync is external.

## What needs a yes

`tables.table_sources.attach`, `crm.records.assert`, and `integrations.sync` once per record. Assert only when next is assert_record. Ambiguous and failed do not sync. Read `crm.record_objects.list` first and copy object_key from that list. Read the provider from `integrations.health_get`.

## Failure cases

- The search errors. Class is failed. Show the error. Do not sync.
- More than one email match, or a name match without one exact email. Class is ambiguous. Show the records.
- Sync returns queued. That is not done. Read `integrations.health_get`.
- A missing secret on the webhook is a stop, not a default.

dry_run first, quote, wait for the owner's yes on that item, on the sync.
