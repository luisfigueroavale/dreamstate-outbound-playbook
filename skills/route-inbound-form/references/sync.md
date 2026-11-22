# One sync

## Inputs

record_id of one published person, and provider hubspot, salesforce, or attio. One record per request.

## Call

integrations.sync is 0 credits and external. dry_run first, quote, wait for the owner's yes on that item. Then live with an idempotency key. The only status this call returns is queued.

## Show the owner

The job id and the word queued. Say it is not done.

## Failure cases

Ambiguous or failed class. Do not call sync.
The owner approved a different record than the one in the dry run. Preview again.
