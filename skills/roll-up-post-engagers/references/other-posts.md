# Posts that are not yours

## Inputs

definition_id source.engaged_with_account. profile_urls comes from an existing column. Do not type profile urls into the repo. The card price is up to 1 credit a row.

## Call

1. tables.sourcing.preview. Free. limit 1 to 10.
2. tables.table_sources.attach with binding_spec.definition_id source.engaged_with_account and source_column_id null. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item.
3. tables.table_sources.run. dry_run first, quote, wait for the owner's yes on that item. Then live with max_credits and an idempotency_key. The per-call ceiling is 50.

## Show the owner

The preview row count, then the quoted credits, then the ceiling you will send.

## Failure cases

You call the definition id as if it were a tools_run capability. Use the three steps above.
You run this path for the sender's own posts. Own posts use harvest at 0 credits.
