# Sender

## Inputs

No required params. Optional limit 1 to 100.

## Call

senders.linkedin_accounts.list is free. Use the account id field named id. Do not write it into a tracked file. Then call social.content.artifact_list with status published, provider linkedin, include_deliveries true, and limit 25. That read is free and has no account filter. Keep an artifact only when the selected sender has a delivery whose status is published and which has a provider_post_id. Take the platform post id from that field. The same account can also have an archived delivery with no post id. That delivery does not count. If no published delivery has a post id, skip the artifact. If none remain, stop. Default the last 10 of the posts you kept, cap 25.

## Show the owner

Which sender you will use, by the display name the list returned, and the post count.

## Failure cases

No sender. Stop.
The list is truncated. Do not guess the missing accounts.
No published delivery for the selected sender has a provider_post_id. Skip that artifact. If none remain, stop.
