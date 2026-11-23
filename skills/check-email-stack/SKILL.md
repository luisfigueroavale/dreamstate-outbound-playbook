---
name: check-email-stack
description: "Read domain DNS, mailbox bounce, and warmup for free, save the JSON, and grade pass or hold. Use before a live sequence. It never changes a sender."
---

# Check email stack

Follow `docs/skill-frame.md`.

## Use when

The owner wants a pass or hold per domain and mailbox. Not for buying domains or mailboxes. That is outside Dreamstate.

## Steps

1. Read domains, DNS, mailboxes, bounce, and warmup (`references/reads.md`).
2. Save the JSON under work/ (`references/save.md`).
3. Grade with the stack rules (`references/grade.md`).
4. Do not change a sender (`references/stop.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `senders.domains.sending.list` | live | no |
| 1 | `senders.domains.health_list` | live | no |
| 1 | `senders.mailboxes.list` | live | no |
| 1 | `senders.mailboxes.health_get` | live | no |
| 1 | `senders.mailboxes.warmup_seed_list_report_get` | live | no |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
