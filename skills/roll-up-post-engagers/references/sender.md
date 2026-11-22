# Sender

## Inputs

No required params. Optional limit 1 to 100.

## Call

senders.linkedin_accounts.list is free. Use the account id field named id. Do not write it into a tracked file. Then call social.content.artifact_list with status published and provider linkedin. That read is free. Resolve each platform post id from the artifact. Default the last 10, cap 25.

## Show the owner

Which sender you will use, by the display name the list returned, and the post count.

## Failure cases

No sender. Stop.
The list is truncated. Do not guess the missing accounts.
