# Optional sandbox

## Inputs

name: Sandbox: quickstart. table_id comes back from tables.workbooks.create. Two fictional rows with row_origin user_supplied go in through tables.rows.create_many on that table_id. Then tables.rows.query reads them back.

## Call

tables.workbooks.create is 0 credits and a write. tables.rows.create_many is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item, for each write. Then live with an idempotency_key. Query is a free read and waits until both writes have a yes.

## Show the owner

The workbook id, the table id, and the two row ids. Say the sandbox stays. Deleting it is a separate yes.

## Failure cases

The owner did not say yes. Skip this step. The quickstart still passes if the other reads passed and writes is 0.
You query before the create has a yes. Do not.
