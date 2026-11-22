# Asset

## Inputs

The link and the file people receive are owned by send-lead-magnet in dreamstate-linkedin-funnel. This skill checks the DM with check-dm-text. Allowed tokens are {{link}} and {{first_name}}. The link must be https. {{first_name}} is dropped when the row has no first name.

## Call

A DM in an existing thread is unibox.context.thread_reply_send. It needs conversation_id, content.body, and a new client_request_id. dry_run first, quote, wait for the owner's yes on that item. Do not start a thread with someone who has not written.

## Show the owner

The checked DM text, or the reason it was dropped.

## Failure cases

You write a new asset sentence in this repo. Do not. Point at the funnel skill.
