---
name: roll-up-post-engagers
description: "Harvest engagers of the last N of your own posts, roll them up, and upsert the touch log and the people worksheet. Use for many posts over time. It does not score fit. That is tier-warm-people."
---

# Roll up post engagers

Follow `docs/skill-frame.md`.

## Use when

The owner wants a warm people worksheet from their own posts. Not for one post that just went live. That job is score-post-engagers in the LinkedIn funnel.

## Steps

1. List senders and pick one at run time (`references/sender.md`).
2. Harvest each own post and read it back (`references/harvest.md`).
3. Roll up touches and skip the team list (`references/rollup.md`).
4. Upsert Warm touches and Warm people (`references/upsert.md`).
5. Use the paid source only for posts that are not yours (`references/other-posts.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `senders.linkedin_accounts.list` | live | no |
| 2 | `visibility.linkedin.engagement_harvest` | dry_run | yes |
| 2 | `visibility.linkedin.engagement_status` | live | no |
| 2 | `visibility.linkedin.engagement_engagers` | live | no |
| 2 | `runs_get` | live | no |
| 4 | `tables.rows.upsert` | dry_run | yes |
| 5 | `source.engaged_with_account` | dry_run | yes |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
