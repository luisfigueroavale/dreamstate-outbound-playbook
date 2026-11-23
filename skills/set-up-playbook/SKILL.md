---
name: set-up-playbook
description: "Confirm the workspace, copy the settings templates, read Company Context, run the offline demo, and list connected senders. Use on a new clone. It does not spend or send."
---

# Set up playbook

Follow `docs/skill-frame.md`.

## Use when

A new clone, before any play is switched on. Also when you are not sure which workspace this folder should use.

## Steps

1. Call whoami and stop unless the owner names the workspace (`references/workspace-check.md`).
2. Copy settings/ to settings.local/ and stop while team.json is blank (`references/settings.md`).
3. Read Company Context and keep the pages out of git (`references/context.md`).
4. Run the offline demo and read every hold (`references/demo.md`).
5. List LinkedIn senders and mailboxes (`references/sender-list.md`).

## Dreamstate tools

| Step | Id | Mode | Needs a yes |
| --- | --- | --- | --- |
| 1 | `whoami` | live | no |
| 3 | `knowledge.context.resolve` | live | no |
| 5 | `senders.linkedin_accounts.list` | live | no |
| 5 | `senders.mailboxes.list` | live | no |

## Stop

A missing or blank file this skill needs means stop. Unknown is not zero. A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
