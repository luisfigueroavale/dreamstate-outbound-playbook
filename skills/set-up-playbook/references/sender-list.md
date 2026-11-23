# Connected senders

## Inputs

senders.linkedin_accounts.list takes an optional limit. senders.mailboxes.list takes an optional limit. Omit both for the full list when has_more is false.

## Call

Free reads. Pass the account id returned as id into later calls. Do not store that id in a tracked file.

## Show the owner

How many LinkedIn senders and mailboxes came back. A zero is a real zero. An error is not a zero.

## Failure cases

No sender is connected. Plays that need one stop. The email grader can still read domains if any exist.
The list is truncated. Say has_more and do not claim the count is complete.
