---
name: share-on-comment-keyword
description: "Read a post's keyword rules, merge one rule without dropping the others, preview each reply from a stable line, and approve only after a yes on that text. Use when a keyword should share a link. The asset text comes from send-lead-magnet."
---

# Share on comment keyword

Follow `docs/skill-frame.md`.

## Use when

The owner has accepted reply lines in settings.local/reply-lines.md and a DM in settings.local/dm-text.md. Not for writing the asset. Not for arming a rule by surprise.

## Steps

1. Read the current rules and the revision (`references/rules.md`).
2. Merge one rule and reject a clash (`references/merge.md`).
3. Replace only with the full set and the expected revision (`references/replace.md`).
4. Preview the stable line and approve that text (`references/reply.md`).
5. Log the status (`references/log.md`).
6. Leave the asset to the funnel skill (`references/asset.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `social.outreach.keyword_dm_rules.list` | live | no |
| 3 | `social.outreach.keyword_dm_rules.replace` | dry_run | yes |
| 4 | `social.comments.reply` | dry_run | yes |
| 4 | `social.comments.approve` | dry_run | yes |
| 5 | `tables.rows.upsert` | dry_run | yes |
| 6 | `unibox.context.thread_reply_send` | dry_run | yes |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
