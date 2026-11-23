# Assert a record

## Inputs

object_key comes from crm.record_objects.list. Do not paste a type name. identity is { kind: "email", value: the normalised email }. values can be an empty object. Call this only when classify-crm-match returns next assert_record. That function runs in the call plan, after the search, because the graph has no CRM results.

## Call

crm.record_objects.list is a free read with no required inputs. Then crm.records.assert. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. The response carries record_id. Pass that id to integrations.sync. A sync is allowed only once a record id exists.

## Show the owner

The object key you copied, whether the record was created, and the record id.

## Failure cases

The list does not contain the object you expected. Stop. Do not invent a key.
Multiple matches. The call refuses. Stop and show the candidate ids.
You sync a new row before this step. Do not.
