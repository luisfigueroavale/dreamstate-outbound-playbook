# Email waterfall

One column tries the lanes in order and stops at the first verified hit. You pay for the lane that found it. Catch-all and unknown stay held.

## Steps

1. Read the configured order with `sequence.outreach.enrichment_sequence_get`. Free. Do not invent lane names.
2. Add `provider.enrich.email` through `tables.columns.add` (0 credits). The card on 2026-11-22 says up to 12.45 credits a row. It does not state a lane floor.
3. Quote one row with `tables.columns.run` in dry_run and `limit: 1`. dry_run first, quote, wait for the owner's yes on that item.
4. Verify with `tables.contacts.verify_email`. 0.45 an address, up to 45 a call on the cost policy. Live still waits for a yes. Catch-all is not treated as invalid, and it is not treated as a personal mailbox you can send to.
5. Phone is `provider.enrich.person.waterfall`. The card says the price varies. Quote it. Do not reuse an old estimate.
6. One person, not a column: `crm.contact.find_email`. Dry run is free. Live is up to 50 credits a call and bills the provider that returns an email.

## What needs a yes

Every live paid call. Adding the column is a write and waits too.

## Run it with

The batch math is [find-verified-email](https://github.com/luisfigueroavale/dreamstate-outbound-engine/blob/main/skills/find-verified-email/SKILL.md) in the outbound engine. This note explains the column. It does not replace that skill.
