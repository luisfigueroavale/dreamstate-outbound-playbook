# Sender

## Inputs

No required params. Optional limit 1 to 100.

## Call

senders.linkedin_accounts.list is free. Use the account id field named id. Do not write it into a tracked file. Then call social.content.artifact_list with status published, provider linkedin, and include_deliveries true. That read is free and has no account filter. Keep an artifact only when a delivery belongs to the selected sender. If you cannot tell who published it, stop. Resolve each platform post id from the artifacts you kept. Default the last 10, cap 25.

## Show the owner

Which sender you will use, by the display name the list returned, and the post count.

## Failure cases

No sender. Stop.
The list is truncated. Do not guess the missing accounts.
An artifact does not show the selected sender. Skip it. If none do, stop.
