# Reads

## Inputs

Domain lists take an optional limit. health_get takes optional account_ids. The warmup report takes mailbox_id, one mailbox at a time, from senders.mailboxes.list.

## Call

All five calls are free reads. They do not query DNS themselves. health_list returns the latest observation. provider_managed true means a consumer mailbox host. SPF, DKIM, and DMARC on that domain are not the owner's to fix.

## Show the owner

A table: domain or mailbox, the raw observation, and whether it was measured. Null bounce is not measured.

## Failure cases

A call fails. Grade the ones that returned and name the failure. Do not fill the gap with a pass.
