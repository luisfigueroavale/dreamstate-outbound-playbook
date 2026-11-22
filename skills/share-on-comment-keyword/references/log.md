# Log

## Inputs

One row per comment. row_kind record. external_key is the comment id. Status is previewed, approved, posted, or failed, plus a reason.

## Call

tables.rows.upsert. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Pass the same idempotency_key on the live call. The comment id is the row identity, so a rerun updates that row.

## Show the owner

The status counts: previewed, approved, posted, failed.

## Failure cases

A failed row with no reason. Do not write it that way.
