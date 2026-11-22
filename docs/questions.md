# Questions

## Does the demo spend credits?

No. `npm run demo` reads fixtures on this machine. The report says credits 0 and sent 0.

## Can the agent send a reply while it installs a play?

No. Import creates a disabled workflow. A reply approve, a DM, a sync, and an enrollment each wait for a yes on that item.

## What if fit is missing?

The row is held. It is not scored as zero and it is not dropped into tier 3.

## Why is queued not done?

`integrations.sync` only returns queued. Read `integrations.health_get` for queue depth, failures, and dead letters.

## Who owns a bad mailbox?

The grade names Sequences and Deliverability. This repo does not pause, buy, or retune a mailbox.

## Where is the cold-batch math?

In dreamstate-outbound-engine. This repo links to it and does not copy the functions.
