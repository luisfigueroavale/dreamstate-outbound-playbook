# Quote

## Inputs

table_id, column_key, limit 1 on the dry run. The live call uses max_credits from the brief. Default ceiling 50, which is also the per-call ceiling.

## Call

tables.columns.run. dry_run first, quote, wait for the owner's yes on that item. Show rows, credits, and quote_hash. Then live with max_credits and an idempotency_key. A refused quote is a price, not a yes.

## Show the owner

Per-row credits and the recommended ceiling. Unknown scores stay unknown.

## Failure cases

The dry run returns no quote_hash. Do not go live.
The owner changes the prompt after the quote. Quote again.
