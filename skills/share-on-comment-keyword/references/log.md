# Log

## Inputs

One row per commenter. Status is previewed, approved, posted, or failed, plus a reason.

## Call

tables.rows.upsert. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item.

## Show the owner

The status counts: previewed, approved, posted, failed.

## Failure cases

A failed row with no reason. Do not write it that way.
