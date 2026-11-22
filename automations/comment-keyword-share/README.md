# Comment keyword share

Read the rules already on a post, merge one rule, and preview a reply. The reply line is picked by a stable hash from the reviewed list, in the call plan, because the graph has no reply list. The log upsert uses external_key from the comment id. The asset text is not written here.

## When

Manual. The post artifact id is resolved at run time.

## Cost

0 credits. Replace, approve, and a DM are external or destructive even at 0.

## What needs a yes

`social.outreach.keyword_dm_rules.replace` after the diff is shown, with `expected_revision`. Each `social.comments.approve` on the frozen text. `unibox.context.thread_reply_send` only when a thread already exists.

dry_run first, quote, wait for the owner's yes on that item.

## Failure cases

- A keyword already used by another rule. The merge stops and the old set stays.
- A rule left out of replace is deleted. Send the full set.
- A stale revision is refused. Re-read. Do not retry the old body.
- The reply list is empty. Stop.
- Preview returns an action id and a content hash. Approve only that pair. If the text changes, preview again.

The file people receive is [send-lead-magnet](https://github.com/luisfigueroavale/dreamstate-linkedin-funnel/blob/main/skills/send-lead-magnet/SKILL.md). This automation does not write that text.
