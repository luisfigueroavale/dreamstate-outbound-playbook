# Harvest

## Inputs

worksheet_id, linkedin_account_id, and post_id. All three are required and resolved at run time.

## Call

visibility.linkedin.engagement_harvest is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Then read visibility.linkedin.engagement_status until done. Read people with visibility.linkedin.engagement_engagers. On timeout, call the MCP tool runs_get with that run_id. wait_seconds is optional and at most 20. It is a free read. It is not a capability id: tools_get on the name runs_get returns not found, and the nearest capability is runs.get. Use the MCP tool. Do not harvest a second time.

## Show the owner

Harvest id, status, and the engager count. A zero can be real. Say the denominator is the posts you harvested.

## Failure cases

Status never reaches done. Stop after the timeout read.
You start a second harvest for the same post. Do not.
