# One sync

## Inputs

record_id from the match or from crm.records.assert. provider from integrations.health_get. Do not paste a provider name into the repo.

## Call

Read integrations.health_get first. Then integrations.sync, one record, 0 credits and external. dry_run first, quote, wait for the owner's yes on that item. The only status this call returns is queued.

## Show the owner

The provider you resolved, the record id, and the word queued.

## Failure cases

No record id yet. Stop.
The owner approved a different record than the dry run. Read health and preview again.
