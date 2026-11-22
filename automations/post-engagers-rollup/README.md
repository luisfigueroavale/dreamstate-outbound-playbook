# Post engagers rollup

Collect engagers of your own recent posts, roll them into a touch log and a people worksheet, quote a fit score, and write a tier and a reason.

## When

Manual in v1. A schedule is a standing action and needs its own yes. Default the last 10 posts, cap 25. Account ids and post ids come from `senders.linkedin_accounts.list` and the sender's posts at run time.

## Cost

Harvest is 0 credits and a write. Fit is 0.04 a row after a one-row quote. `tables.columns.run` has a per-call ceiling of 50. Posts that are not yours are `source.engaged_with_account` at 1 credit a row, quoted. The credit ceiling for the run is a required input. The working default is 50.

## What needs a yes

Harvest, each upsert, adding the fit column, and the live score. dry_run first, quote, wait for the owner's yes on that item.

## Failure cases

- Harvest does not finish. Read `runs_get` on the same key. Do not start a second harvest.
- A repost or a post with no id is skipped.
- A person in the team list is excluded.
- Fit is unknown. The tier is hold.
- The weekly cap is full. Extra tier 1 rows become tier 2 with a reason.

Worksheets are named in [worksheets.md](worksheets.md). Ids are created at run time.
