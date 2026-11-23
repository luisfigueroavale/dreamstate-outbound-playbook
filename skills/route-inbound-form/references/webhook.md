# Webhook attach

## Inputs

table_id resolved at run time. source_column_id null, because the source owns the rows. binding_spec.definition_id is source.webhook_source. input_bindings set require_secret to the literal true and upsert_field to the literal email. The card lists require_secret as optional. This repo always sets it to true.

## Call

tables.table_sources.attach. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. There is no form trigger on a workflow. The graph stays manual_run until the worksheet id exists, which is why the attach names the worksheet at import time and the graph does not.

## Show the owner

The worksheet you will bind, and that the secret is required.

## Failure cases

The card no longer accepts those fields. Stop.
You attach without a secret. Do not.
