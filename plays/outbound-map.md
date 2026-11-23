# Outbound map

Find the people, fill the gaps, judge fit, write one note, hand off a draft, and record what happened. Each step has one seat. A later step does not start because an earlier one looked finished.

## Steps

1. Find. Lead Sourcer runs `tables.sourcing.preview` for a free first look, then `tables.company_search.run` or `tables.people_search.run`. A paid row is quoted first. `source.company_search` is up to 1 credit a row on the card. `provider.linkedin.people.search` is 0 a row and still gets a quote before a live run. It also needs a sender.
2. Fill. Add `provider.enrich.email` with `tables.columns.add`, then quote it. The card says up to 12.45 credits a row. Verify with `tables.contacts.verify_email` at 0.45 an address, also quoted. Catch-all is held. dry_run first, quote, wait for the owner's yes on that item.
3. Judge. Add `column.ai_fit_score` first. That write waits for a yes. The score is 0.04 a row on a 0 to 100 scale. `tables.columns.run` is quoted with `limit: 1` before a live run. The per-call ceiling is 50.
4. Write. Outbound Copywriter writes from a fact in Company Context. Unknown is held.
5. Hand off. Sequences and Deliverability creates a draft with `sequence.sequences.create_from_worksheet` at 0 credits. The draft is a write and waits for a yes. `sequence.sequences.enroll_selection` and `sequence.sequences.activate_audience` each wait for their own yes.
6. Record. `integrations.sync` is 0 credits and external. It returns queued. Read `integrations.health_get` before anyone calls it done.

## What needs a yes

A paid search, the email column, verification, adding the fit column, the live score, the draft, an enrollment, an activation, and each CRM sync. A zero credit price does not skip the quote.

## Run it with

[pick-a-play](../skills/pick-a-play/SKILL.md). The account math for a cold batch lives in [dreamstate-outbound-engine](https://github.com/luisfigueroavale/dreamstate-outbound-engine).
