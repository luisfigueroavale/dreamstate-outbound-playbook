# Fit column

## Inputs

table_id, name, and binding_spec.definition_id column.ai_fit_score. The fixed output is score 0 to 100. Cost on the card is 0.04 credits a row. Adding the column is 0 credits.

## Call

tables.columns.add. dry_run first, quote, wait for the owner's yes on that item. The prompt comes from Company Context, not from a guessed rubric.

## Show the owner

The column key the run step will use.

## Failure cases

Ideal Customer is missing. Stop. Do not write a prompt from memory.
