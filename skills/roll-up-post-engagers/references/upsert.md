# Upsert

## Inputs

Two worksheets, both resolved at run time. Warm touches: row_kind record, external_key is the touch key (person id, post id, kind, reaction). Warm people: row_kind person, subject_id is the person id. See automations/post-engagers-rollup/worksheets.md.

## Call

tables.rows.upsert is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Send the same idempotency_key on the live call as on the dry run. One call per row. The touch key or the person id is that row's identity.

## Show the owner

How many rows the dry run would write on each worksheet. Do not claim they exist until the live call returns.

## Failure cases

The worksheet id is missing. Stop. Do not create a second workbook to hide the miss.
A rerun uses a new key. Do not. The same touch key and the same person id update the existing row.
