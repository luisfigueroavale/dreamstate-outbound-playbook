# Import

## Inputs

kind workflow, name from the graph, document, and an idempotency key. Do not pass an automation id. The server creates a new disabled draft.

## Call

workflow.automations.import. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Then live with the idempotency key.

## Show the owner

The new automation id and that status is disabled. Say enable has not been called.

## Failure cases

The call would reuse an existing id. Stop. Do not overwrite.
The owner said no. Leave the file in git and do not import.
