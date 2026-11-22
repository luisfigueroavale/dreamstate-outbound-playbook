# Form to CRM

One inbound form becomes one CRM decision. Missing and malformed emails stop. A personal mailbox is marked and held. A duplicate of the same email and form id is held. The CRM search runs before any push.

## When

A webhook row lands. `source.webhook_source` is 0 credits on the minimum. The catalog did not state a maximum. Set `require_secret` and `upsert_field` to email. The worksheet id is resolved at run time.

The workflow graph uses `manual_run` because the node catalog did not return a form trigger. Binding the source to a worksheet is still how the row arrives.

## Cost

0 credits for the search, the preview, and the sync. The sync is external.

## What needs a yes

`integrations.sync` once per record, and only when the class is `new` or `existing`. Ambiguous and failed do not sync. Provider is `hubspot`, `salesforce`, or `attio`.

## Failure cases

- The search errors. Class is failed. Show the error. Do not sync.
- More than one email match, or a name match without one exact email. Class is ambiguous. Show the records.
- Sync returns queued. That is not done. Read `integrations.health_get`.
- A missing secret on the webhook is a stop, not a default.

dry_run first, quote, wait for the owner's yes on that item, on the sync.
