# Outbound map

Find the people, fill the gaps, judge fit, write one note, hand off a draft, and record what happened. Each step has one seat. A later step does not start because an earlier one looked finished.

## Steps

1. Find. Lead Sourcer runs `tables.sourcing.preview` for a free first look, then `tables.company_search.run` or `tables.people_search.run`. A paid row is quoted first. `source.company_search` is 1 credit a row on the card. `provider.linkedin.people.search` is 0 a row and needs a sender.
2. Fill. The work email column is `provider.enrich.email`. It tries lanes and stops at the first verified hit. The card says up to 12.45 credits a row. Verify with `tables.contacts.verify_email` at 0.45 an address. Catch-all is held.
3. Judge. `column.ai_fit_score` is 0.04 a row on a 0 to 100 scale. `tables.columns.run` is quoted with `limit: 1` before a live run. The per-call ceiling is 50.
4. Write. Outbound Copywriter writes from a fact in Company Context. Unknown is held.
5. Hand off. Sequences and Deliverability creates a draft with `sequence.sequences.create_from_worksheet` at 0 credits. `sequence.sequences.enroll_selection` and `sequence.sequences.activate_audience` wait for a yes.
6. Record. `integrations.sync` is 0 credits and external. It returns queued. Read `integrations.health_get` before anyone calls it done.

## What needs a yes

A paid search, a live column, an enrollment, an activation, and each CRM sync. A draft does not.

## Run it with

[pick-a-play](../skills/pick-a-play/SKILL.md). The account math for a cold batch lives in [dreamstate-outbound-engine](https://github.com/luisfigueroavale/dreamstate-outbound-engine).
