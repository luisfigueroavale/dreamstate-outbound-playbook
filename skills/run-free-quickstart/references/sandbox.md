# Optional sandbox

## Inputs

name: Sandbox: quickstart. Two fictional rows with row_origin user_supplied. Then tables.rows.query with the returned table id.

## Call

tables.workbooks.create is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Then live with an idempotency_key. Query is a free read.

## Show the owner

The workbook id and the two row ids. Say the sandbox stays. Deleting it is a separate yes.

## Failure cases

The owner did not say yes. Skip this step. The quickstart still passes if the other reads passed and writes is 0.
