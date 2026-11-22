# Reply

## Inputs

comment_id and account_id resolved at run time. text is the line from pick-reply-line. Lines come from settings.local/reply-lines.md. An empty file stops. The hash is the first 8 hex digits of SHA-256 of the comment id, modulo the line count. The same comment always gets the same line.

## Call

social.comments.reply returns action_id and content_hash. social.comments.approve posts that frozen pair and needs approved true. dry_run first, quote, wait for the owner's yes on that item, on the approve. 0 credits, and it still posts.

## Show the owner

The exact text. After a yes, do not edit a character.

## Failure cases

The line list is blank. Stop.
content_hash does not match. Preview again. Do not approve.
