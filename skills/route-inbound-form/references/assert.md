# Assert a record

## Inputs

object_key person. identity is { kind: "email", value: the normalised email }. values can be an empty object. Call this only when classify-crm-match returns next assert_record.

## Call

crm.records.assert. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. The response carries record_id. Pass that id to integrations.sync. A sync is allowed only once a record id exists.

## Show the owner

Whether the record was created, and the record id.

## Failure cases

Multiple matches. The call refuses. Stop and show the candidate ids.
You sync a new row before this step. Do not.
