# Sender

## Inputs

No required params. Optional limit 1 to 100.

## Call

senders.linkedin_accounts.list is free. Use the account id field named id. Do not write it into a tracked file. Default the last 10 posts, cap 25. Post ids are resolved at run time too.

## Show the owner

Which sender you will use, by the display name the list returned, and the post count.

## Failure cases

No sender. Stop.
The list is truncated. Do not guess the missing accounts.
