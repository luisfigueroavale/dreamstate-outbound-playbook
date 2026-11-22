# Test loop

Change one thing. Split by a stable hash. Read only delivered messages. Call a result only past the review floor.

## Steps

1. Pick one change in the note. Leave the audience, the sender, and the other steps alone.
2. Assign the variant with a stable hash so the same person stays on the same side. The function lives in the engine skill below. This repo does not keep a second copy.
3. Launch only after a yes. This play does not enroll.
4. Read `sequence.sequences.variants_get`. Sent is people messaged. Replied is people whose reply is tied to a message. A rate with no denominator is not a rate. Opened and clicked are not in that ledger, so they stay null.
5. Compare with `sequence.outreach.analytics_variant_compare` and one objective. A group under 30 people is insufficient data on that read. Do not call it a winner.

## What needs a yes

The launch, and any later change to a live sequence.

## Run it with

[design-copy-test](https://github.com/luisfigueroavale/dreamstate-outbound-engine/blob/main/skills/design-copy-test/SKILL.md) and [read-results](https://github.com/luisfigueroavale/dreamstate-outbound-engine/blob/main/skills/read-results/SKILL.md).
