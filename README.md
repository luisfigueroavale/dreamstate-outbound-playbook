# Dreamstate Outbound Playbook

**The outbound plays we run on Dreamstate, each one readable in a minute and installable one at a time.**

The decision math for a cold batch lives in dreamstate-outbound-engine. This repo is the plays around it.

You get a free check, three automations, six play cards, and a cost sheet. The check proves the workspace is wired and spent nothing. The automations stay off until you import one. The cards are the plays on one page. They use the colors and the sans stack in `brand/tokens.css`. Those values are working defaults so a card can render before `brand.local/` exists. Fill `brand.local/tokens.css` when you have the owner's colors. Nothing sends without you.

## Who it is for

A founder or a small team on Dreamstate, or about to be, who wants the whole outbound setup on one screen, a try at zero credits, and then one play at a time.

## What the agent will not do

It will not send, post, enroll, sync to a CRM, switch on a workflow or a rule, spend credits, or delete anything without your yes on that item. It will not invent a fact, a number, or a customer. Unknown fit is held.

## The first 30 minutes

1. `npx @trydreamstate/cli install`, then sign in in the browser.
2. Run `npm run demo`, then read the markdown it writes at `output/demo/report.md`. The file walks one made-up week and states why each row was held.
3. Open the folder in Codex or Claude Code and run `run-free-quickstart`. It calls `whoami`, confirms the workspace, makes only free reads, and shows 0 credits spent.
4. Copy `settings/` to `settings.local/` and fill `team.json` and `tiers.json` with the agent.
5. Run `check-email-stack` (free reads) and read the pass or hold per domain and mailbox.
6. Pick one play with `pick-a-play`. Run `npm run plan-install` and read its calls. Nothing has run.
7. `npm install && npm run check`.
8. Stop. Nothing has been sent or spent.

## Two ways to run

The Dreamstate app, or Codex and Claude Code through the MCP and the CLI. State lives in the workspace either way. See [docs/two-ways-to-run.md](docs/two-ways-to-run.md).

## How a week moves

One play at a time. The 08:00 rollup can add one line from free reads: forms waiting for a yes, warm people by tier, keyword replies waiting, and email stack holds. A schedule or a workflow enable is its own yes.

## What is in the box

| Piece | Count | Where |
| --- | --- | --- |
| Skills | 9 skills | `skills/` |
| Functions | 9 functions | `functions/` |
| Automations | 3 automations | `automations/` |
| Plays | 6 plays | `plays/` and `cards/` |

## The five primitives

| Primitive | Dreamstate ids | Cost | Skill |
| --- | --- | --- | --- |
| Find | `tables.sourcing.preview`, `source.company_search` | Preview free. Company rows 1 credit. Quote a run. | `pick-a-play` |
| Fill | `provider.enrich.email`, `tables.contacts.verify_email` | Up to 12.45 a row. Verify 0.45 an address. | Engine `find-verified-email` |
| Signal | `source.engaged_with_account`, `visibility.linkedin.engagement_harvest` | Up to 1 a row, or 0 for your own posts. | `roll-up-post-engagers` |
| Judge | `column.ai_fit_score`, `tables.columns.run` | 0.04 a row, quoted. | `tier-warm-people` |
| Hand off | `sequence.sequences.create_from_worksheet`, `integrations.sync` | Draft free. Sync is 0 and returns queued. | `route-inbound-form` |

More in [docs/primitives.md](docs/primitives.md).

## Automations

| Name | Trigger | What it does | Cost | What needs a yes |
| --- | --- | --- | --- | --- |
| `form-to-crm` | Webhook with a secret | Classifies one form, then one sync | 0 credits | Each sync |
| `post-engagers-rollup` | Manual | Harvests your posts and rolls them up | 0 for your posts, then 0.04 a scored row | Harvest, upsert, the quote |
| `comment-keyword-share` | Manual | Merges one rule and previews each reply | 0 credits | Replace, each approve, any DM |

## Play cards

[![Find, fill, judge, write, hand off, record](cards/outbound-map.svg)](plays/outbound-map.md)

[![What must be true before the first send](cards/email-stack.svg)](plays/email-stack.md)

[![Pay for the lane that found the email](cards/email-waterfall.svg)](plays/email-waterfall.md)

[![People who show up more than once](cards/engager-tiers.svg)](plays/engager-tiers.md)

[![Four rules before you write](cards/signal-plays.svg)](plays/signal-plays.md)

[![Change one thing, then read it back](cards/test-loop.svg)](plays/test-loop.md)

## Skills

| Name | What it does | Cost |
| --- | --- | --- |
| `set-up-playbook` | Confirm the workspace, copy settings, run the demo | Free |
| `run-free-quickstart` | The free check, plus an optional sandbox after a yes | 0 credits |
| `pick-a-play` | Suggest one next play | Free |
| `install-automation` | Preflight, lint, import disabled | 0 credits. Import needs a yes |
| `route-inbound-form` | Webhook, CRM class, one sync | 0 credits. Each sync needs a yes |
| `roll-up-post-engagers` | Harvest and roll up your posts | 0 for your posts. Harvest needs a yes |
| `tier-warm-people` | Score and tier. Draft for tier 2 | 0.04 a row, quoted |
| `share-on-comment-keyword` | Safe rule edit and a stable reply | 0 credits. Replace and approve need a yes |
| `check-email-stack` | Pass or hold per domain and mailbox | Free |

## What it costs

| Example | Ceiling on 2026-11-22 |
| --- | --- |
| A week of own-post engagers, 58 people scored | 2.32 credits after a one-row quote |
| 50 inbound forms | 0 credits, one yes per sync |
| 200 addresses verified | 90 credits if every address is billed |

The full sheet, including the email-column ceiling, is [docs/costs.md](docs/costs.md). A paid step still says: dry_run first, quote, wait for the owner's yes on that item.

## Where to look

Worksheets, runs, approvals, and spend are in [docs/where-to-look.md](docs/where-to-look.md).

## What this is not

- Not the cold-batch math. That is the outbound engine.
- Not a sender.
- Not a shop for domains or mailboxes.
- Not a copy of the funnel's one-post scorer or file delivery.
- Not a price list for plans or seats.

## Questions

[docs/questions.md](docs/questions.md).

The demo spends nothing. A missing fit score is a hold. Queued is not done.

## Map

| Path | What it is |
| --- | --- |
| `skills/` | 9 skills the agent follows |
| `functions/` | 9 pure functions with tests |
| `automations/` | 3 disabled graphs and call plans |
| `plays/` | 6 one-page notes |
| `cards/` | 6 card sources and the rendered SVGs |
| `settings/` | Blank files and working defaults |
| `docs/` | Quickstart, costs, tool map, and the limits |
| `examples/sample-week/` | Fictional Ledgerlight week |

## Names you never want in the repo

`.banned-terms.local` sits on the machine, one name per line, and is not committed. `npm run check` prints `BANNED-TERM SCAN SKIPPED` when the file is absent. `npm run check -- --strict` fails when it is absent. A worktree reads the copy in the main checkout.

## Part of the Dreamstate GTM team

| Repo | What it owns |
| --- | --- |
| [dreamstate-gtm-team](https://github.com/luisfigueroavale/dreamstate-gtm-team) | Seats, rules, and the brand templates |
| [dreamstate-outbound-engine](https://github.com/luisfigueroavale/dreamstate-outbound-engine) | Fit, tiers, verified email, and test math for one cold batch |
| [dreamstate-linkedin-funnel](https://github.com/luisfigueroavale/dreamstate-linkedin-funnel) | One post's engagers, and the file you share |
| [dreamstate-geo](https://github.com/luisfigueroavale/dreamstate-geo) | Answer-engine visibility |
| [dreamstate-design](https://github.com/luisfigueroavale/dreamstate-design) | Design checks |
| [dreamstate-plugins](https://github.com/luisfigueroavale/dreamstate-plugins) | Install and the Dreamstate skills |
| [dreamstate-launch-videos](https://github.com/luisfigueroavale/dreamstate-launch-videos) | Launch films |

## Next step

Start with `docs/quickstart.md`. More about Dreamstate at [trydreamstate.com](https://trydreamstate.com).

## License

MIT. Copyright (c) 2026 Luis Vale. See [LICENSE](LICENSE).
