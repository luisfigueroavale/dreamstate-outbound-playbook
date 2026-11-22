# What it costs

Credits, from the contracts and cards read on 2026-11-22. These are ceilings and unit prices, not a quote. A live paid call still says: dry_run first, quote, wait for the owner's yes on that item. A refused quote is a price, not a yes.

This page does not quote a plan or a seat. Read the workspace with `workspace.usage.status_get`.

| Step | Price that day |
| --- | --- |
| Own-post harvest | 0 credits, and it is a write |
| Fit score | 0.04 credits a row |
| Work email column | up to 12.45 credits a row. A lane floor was not on the card |
| Verify an address | 0.45 credits, maximum 45 a call |
| One email lookup | dry run 0, live up to 50 |
| Engaged with an account | 1 credit a row |
| Web search column | 4 credits a row |
| Research column | price varies |
| Phone waterfall | price varies |
| Form sync | 0 credits, external, queued is not done |

## A week of engagers

Own posts only. Harvest is 0. The sample week keeps 58 people. Scoring all of them is 58 times 0.04, which is 2.32 credits, inside one `tables.columns.run` ceiling of 50. Quote one row first. The live total is the quote, not this product. Posts that are not yours add 1 credit a row and are a separate yes.

## 50 inbound forms

Search, preview, and sync are 0 credits. Fifty syncs are fifty yes items, one record each, unless the owner groups a yes in words you can point at. Each sync returns queued. Confirmed means `integrations.health_get` later shows the outcome. Queued is not that outcome.

## A 200 person email pass

Verify every address at 0.45 credits is 90 credits if every address is billed. The cost policy maximum is 45 credits a call, so 200 addresses do not fit in one call at that cap. The usage line also asks for a live ceiling from 3 to 300. Use the ceiling the dry run names.

The email column at the top of the card is 12.45 times 200, which is 2490 credits, only if every row pays that top. You pay the lane that hit. 2490 is a ceiling. Catch-all and unknown are held and should not be retried as if they were misses you can ignore.

The phone waterfall card says the price varies. Do not reuse an older estimate.
