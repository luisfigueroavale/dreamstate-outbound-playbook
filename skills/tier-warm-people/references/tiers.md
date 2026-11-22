# Tiers

## Inputs

People rows plus settings.local/tiers.json. Working defaults: top 75, middle 55, 30 days, cap 10 a week. as_of is the run time the owner agrees.

## Call

Local function tier-engagers runs in the call plan, not the graph. The graph has no fit rules or score to pass in. Tier 1 needs the top fit and a comment or two distinct posts. Fit of 75 is tier 1 when the other rule holds, and fit of 55 is tier 2. Unknown fit or a teammate is hold. Older than the window drops one tier. Overflow past the cap becomes tier 2 with a reason. Then tables.rows.upsert writes the tier and the reason, with subject_id set to the person id. 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item.

## Show the owner

The counts by tier and one reason from each tier. A change to tiers.json waits for a learning note and a yes.

## Failure cases

You drop unknown fit into tier 3. Do not. Hold it.
